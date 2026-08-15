import { Router } from "express";
import { prisma } from "../prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { authenticate, assertSchoolAccess, requireRole } from "../auth/middleware";
import { badRequest, forbidden, notFound } from "../lib/errors";
import { emitAlertUpdated } from "../sockets/gateway";

export const operationsRouter = Router();
operationsRouter.use(authenticate);
operationsRouter.use(requireRole("ops_room", "school_admin", "owner", "partner"));

function scopeFilter(user: NonNullable<import("express").Request["user"]>) {
  if (user.role === "owner" || user.role === "partner") return {};
  return { schoolId: user.schoolId! };
}

/* ---- OPS-01: all trips currently active, for the control-room map ---- */
operationsRouter.get(
  "/operations/active-trips",
  asyncHandler(async (req, res) => {
    const trips = await prisma.trip.findMany({
      where: { status: "active", ...scopeFilter(req.user!) },
      include: { bus: true },
    });
    res.json(trips);
  })
);

/* ---- OPS-02: alerts inbox ---- */
operationsRouter.get(
  "/alerts",
  asyncHandler(async (req, res) => {
    const status = String(req.query.status ?? "active");
    const alerts = await prisma.alert.findMany({
      where: { status: status as any, ...scopeFilter(req.user!) },
      orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
    });
    res.json(alerts);
  })
);

async function loadAlert(id: string) {
  const alert = await prisma.alert.findUnique({ where: { id } });
  if (!alert) throw notFound("Alert");
  return alert;
}

operationsRouter.put(
  "/alerts/:id/acknowledge",
  asyncHandler(async (req, res) => {
    const alert = await loadAlert(req.params.id);
    assertSchoolAccess(req.user!, alert.schoolId);
    const { assignedToUserId } = req.body ?? {};
    const updated = await prisma.alert.update({
      where: { id: alert.id },
      data: { status: "acknowledged", acknowledgedAt: new Date(), assignedToUserId: assignedToUserId ?? req.user!.sub },
    });
    emitAlertUpdated(updated);
    res.json(updated);
  })
);

operationsRouter.put(
  "/alerts/:id/resolve",
  asyncHandler(async (req, res) => {
    const alert = await loadAlert(req.params.id);
    assertSchoolAccess(req.user!, alert.schoolId);
    const { reason } = req.body ?? {};
    if (!reason) throw badRequest("reason is required");
    const updated = await prisma.alert.update({
      where: { id: alert.id },
      data: { status: "resolved", resolvedAt: new Date(), resolutionReason: reason },
    });
    emitAlertUpdated(updated);
    res.json(updated);
  })
);

/* ---- SF-9 / o-not-collected: escalated student-not-collected incidents ---- */
operationsRouter.get(
  "/operations/not-collected",
  asyncHandler(async (req, res) => {
    const alerts = await prisma.alert.findMany({
      where: { type: "student_not_collected", status: "active", ...scopeFilter(req.user!) },
      include: { bus: true, trip: true },
      orderBy: { createdAt: "asc" },
    });
    res.json(alerts);
  })
);

operationsRouter.post(
  "/operations/not-collected/:id/instruct",
  asyncHandler(async (req, res) => {
    const alert = await loadAlert(req.params.id);
    assertSchoolAccess(req.user!, alert.schoolId);
    const { instruction } = req.body ?? {};
    if (!instruction) throw badRequest("instruction is required");
    if (!alert.busId) throw badRequest("This incident has no associated bus");

    const bus = await prisma.bus.findUnique({ where: { id: alert.busId } });
    if (!bus?.supervisorId) throw badRequest("No supervisor assigned to this bus");

    const record = await prisma.operationsMessage.create({
      data: { fromUserId: req.user!.sub, toUserId: bus.supervisorId, message: instruction, channel: "app" },
    });
    await prisma.incidentAction.create({ data: { alertId: alert.id, userId: req.user!.sub, note: `تعليمة: ${instruction}` } });
    res.status(201).json(record);
  })
);

/* ---- O-5: incidents list (all alerts, any status, with resolution summary) ---- */
operationsRouter.get(
  "/incidents",
  asyncHandler(async (req, res) => {
    const incidents = await prisma.alert.findMany({
      where: scopeFilter(req.user!),
      include: { bus: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    res.json(incidents);
  })
);

/* ---- OPS-03: incident detail == an alert with its trip/bus/action-log context ---- */
operationsRouter.get(
  "/incidents/:id",
  asyncHandler(async (req, res) => {
    const alert = await prisma.alert.findUnique({
      where: { id: req.params.id },
      include: {
        trip: { include: { bus: true, supervisor: true } },
        bus: true,
        incidentActions: { orderBy: { createdAt: "asc" }, include: { user: true } },
      },
    });
    if (!alert) throw notFound("Incident");
    assertSchoolAccess(req.user!, alert.schoolId);
    res.json(alert);
  })
);

operationsRouter.post(
  "/incidents/:id/actions",
  asyncHandler(async (req, res) => {
    const alert = await loadAlert(req.params.id);
    assertSchoolAccess(req.user!, alert.schoolId);
    const { note } = req.body ?? {};
    if (!note) throw badRequest("note is required");
    const action = await prisma.incidentAction.create({
      data: { alertId: alert.id, userId: req.user!.sub, note },
    });
    res.status(201).json(action);
  })
);

operationsRouter.post(
  "/incidents/:id/notify-parents",
  asyncHandler(async (req, res) => {
    const alert = await loadAlert(req.params.id);
    assertSchoolAccess(req.user!, alert.schoolId);
    const { message } = req.body ?? {};
    if (!message) throw badRequest("message is required");

    const busId = alert.busId;
    if (!busId) throw forbidden("This incident has no associated bus to notify parents about");

    const students = await prisma.student.findMany({ where: { busId }, include: { parentLinks: true } });
    const parentIds = [...new Set(students.flatMap((s) => s.parentLinks.map((l) => l.parentUserId)))];
    await prisma.notification.createMany({
      data: parentIds.map((userId) => ({ userId, title: "تنبيه من غرفة العمليات", body: message, type: "incident" })),
    });
    res.status(201).json({ ok: true, recipients: parentIds.length });
  })
);

/* ---- OPS-04: direct message to a supervisor/other user ---- */
operationsRouter.post(
  "/operations/messages",
  asyncHandler(async (req, res) => {
    const { toUserId, message, channel } = req.body ?? {};
    if (!toUserId || !message) throw badRequest("toUserId and message are required");
    const record = await prisma.operationsMessage.create({
      data: { fromUserId: req.user!.sub, toUserId, message, channel: channel ?? "app" },
    });
    res.status(201).json(record);
  })
);

/* ---- OPS-05: daily report ---- */
operationsRouter.get(
  "/operations/daily-report",
  asyncHandler(async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const scope = scopeFilter(req.user!);
    const trips = await prisma.trip.findMany({ where: { scheduledAt: { gte: startOfDay, lte: endOfDay }, ...scope } });
    const alerts = await prisma.alert.findMany({ where: { createdAt: { gte: startOfDay, lte: endOfDay }, ...scope } });
    const studentsTransported = await prisma.tripEvent.count({
      where: { type: "board", timestamp: { gte: startOfDay, lte: endOfDay }, trip: scope },
    });

    res.json({
      date: startOfDay.toISOString().slice(0, 10),
      tripsCompleted: trips.filter((t) => t.status === "completed").length,
      tripsActive: trips.filter((t) => t.status === "active").length,
      tripsCancelled: trips.filter((t) => t.status === "cancelled").length,
      studentsTransported,
      alertsTotal: alerts.length,
      alertsByPriority: {
        urgent_critical: alerts.filter((a) => a.priority === "urgent_critical").length,
        urgent: alerts.filter((a) => a.priority === "urgent").length,
        notice: alerts.filter((a) => a.priority === "notice").length,
      },
    });
  })
);
