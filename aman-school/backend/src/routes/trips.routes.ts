import { Router } from "express";
import { prisma } from "../prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { authenticate, assertSchoolAccess, requireRole } from "../auth/middleware";
import { badRequest, forbidden, notFound } from "../lib/errors";
import { emitTripEvent, emitTripUpdated, emitAlertNew } from "../sockets/gateway";
import { activeDelegateFor } from "./students.routes";

export const tripsRouter = Router();
tripsRouter.use(authenticate);

async function loadTrip(tripId: string) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId }, include: { bus: true } });
  if (!trip) throw notFound("Trip");
  return trip;
}

/* ---- S-02: assign the calling supervisor to a scheduled trip ---- */
tripsRouter.post(
  "/trips/:id/assign-supervisor",
  requireRole("supervisor"),
  asyncHandler(async (req, res) => {
    const trip = await loadTrip(req.params.id);
    assertSchoolAccess(req.user!, trip.schoolId);
    if (trip.bus.supervisorId && trip.bus.supervisorId !== req.user!.sub) {
      throw forbidden("This bus is assigned to a different supervisor");
    }
    const updated = await prisma.trip.update({ where: { id: trip.id }, data: { supervisorId: req.user!.sub } });
    emitTripUpdated(updated);
    res.json(updated);
  })
);

/* ---- S-03: roster for a trip (students on the trip's bus) ---- */
tripsRouter.get(
  "/trips/:id/students",
  asyncHandler(async (req, res) => {
    const trip = await loadTrip(req.params.id);
    assertSchoolAccess(req.user!, trip.schoolId);
    const students = await prisma.student.findMany({
      where: { busId: trip.busId, status: "active" },
      orderBy: [{ stopId: "asc" }, { name: "asc" }],
    });
    res.json(students);
  })
);

/* ---- S-04: start trip + activate GPS ---- */
tripsRouter.post(
  "/trips/:id/start",
  requireRole("supervisor"),
  asyncHandler(async (req, res) => {
    const trip = await loadTrip(req.params.id);
    assertSchoolAccess(req.user!, trip.schoolId);
    if (trip.status !== "scheduled") throw badRequest(`Trip is already ${trip.status}`);

    if (trip.shift === "evening") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const morningTrip = await prisma.trip.findFirst({
        where: { busId: trip.busId, shift: "morning", scheduledAt: { gte: startOfDay } },
      });
      if (morningTrip && morningTrip.status !== "completed" && morningTrip.status !== "cancelled") {
        throw badRequest("لا يمكن بدء الرحلة المسائية قبل إنهاء الرحلة الصباحية رسمياً");
      }
    }

    const updated = await prisma.trip.update({
      where: { id: trip.id },
      data: { status: "active", startedAt: new Date(), supervisorId: trip.supervisorId ?? req.user!.sub },
    });
    await prisma.bus.update({ where: { id: trip.busId }, data: { gpsActive: true } });
    emitTripUpdated(updated);
    res.json(updated);
  })
);

/* ---- S-05: NFC/manual board — must respond fast (<500ms), no artificial work ---- */
tripsRouter.post(
  "/trips/:id/board",
  requireRole("supervisor"),
  asyncHandler(async (req, res) => {
    const trip = await loadTrip(req.params.id);
    assertSchoolAccess(req.user!, trip.schoolId);
    const { studentId, method = "nfc", manualReason } = req.body ?? {};
    if (!studentId) throw badRequest("studentId is required");

    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student || student.schoolId !== trip.schoolId) throw notFound("Student");

    const alreadyBoarded = await prisma.tripEvent.findFirst({
      where: { tripId: trip.id, studentId, type: "board" },
    });
    if (alreadyBoarded) throw badRequest("الطالب مسح مسبقاً في هذه الرحلة — student already boarded this trip");

    const event = await prisma.tripEvent.create({
      data: { tripId: trip.id, studentId, type: "board", method, manualReason: manualReason ?? null },
    });
    emitTripEvent(event, trip.busId, trip.schoolId);
    res.status(201).json(event);
  })
);

/* ---- SF-5: whether this student has an active pickup delegate — the
 * supervisor app calls this before showing s-verify-pickup ---- */
tripsRouter.get(
  "/trips/:id/students/:studentId/pickup-info",
  requireRole("supervisor", "ops_room", "school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    const trip = await loadTrip(req.params.id);
    assertSchoolAccess(req.user!, trip.schoolId);
    const delegate = await activeDelegateFor(req.params.studentId);
    res.json({ activeDelegate: delegate });
  })
);

tripsRouter.post(
  "/trips/:id/alight",
  requireRole("supervisor"),
  asyncHandler(async (req, res) => {
    const trip = await loadTrip(req.params.id);
    assertSchoolAccess(req.user!, trip.schoolId);
    const { studentId, verifiedBy, delegateId } = req.body ?? {};
    if (!studentId) throw badRequest("studentId is required");

    const boarded = await prisma.tripEvent.findFirst({ where: { tripId: trip.id, studentId, type: "board" } });
    if (!boarded) throw badRequest("الطالب لم يسجل صعوده في هذه الرحلة — student has not boarded this trip");
    const alreadyAlighted = await prisma.tripEvent.findFirst({
      where: { tripId: trip.id, studentId, type: "alight" },
    });
    if (alreadyAlighted) throw badRequest("Student already recorded as alighted on this trip");

    const event = await prisma.tripEvent.create({
      data: {
        tripId: trip.id, studentId, type: "alight", method: "nfc",
        manualReason: verifiedBy === "delegate" ? `delegate_verified:${delegateId ?? ""}` : null,
      },
    });
    emitTripEvent(event, trip.busId, trip.schoolId);
    res.status(201).json(event);
  })
);

/* ---- SF-6: not-collected protocol — auto-escalated by the supervisor app
 * timer (60s wait, then 3min, then 5min → critical incident to ops room) ---- */
tripsRouter.post(
  "/trips/:id/students/:studentId/not-collected",
  requireRole("supervisor"),
  asyncHandler(async (req, res) => {
    const trip = await loadTrip(req.params.id);
    assertSchoolAccess(req.user!, trip.schoolId);
    const student = await prisma.student.findUnique({ where: { id: req.params.studentId } });
    if (!student) throw notFound("Student");

    const existing = await prisma.alert.findFirst({
      where: { tripId: trip.id, busId: trip.busId, type: "student_not_collected", status: "active" },
    });
    if (existing) return res.status(200).json(existing);

    const alert = await prisma.alert.create({
      data: {
        schoolId: trip.schoolId, tripId: trip.id, busId: trip.busId,
        type: "student_not_collected", priority: "urgent_critical",
        message: `لم يُستلم الطالب ${student.name} من محطته`,
      },
    });
    emitAlertNew(alert);
    res.status(201).json(alert);
  })
);

tripsRouter.put(
  "/trips/:id/students/:studentId/collected",
  requireRole("supervisor", "ops_room", "school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    const trip = await loadTrip(req.params.id);
    assertSchoolAccess(req.user!, trip.schoolId);
    const { note } = req.body ?? {};

    const boarded = await prisma.tripEvent.findFirst({
      where: { tripId: trip.id, studentId: req.params.studentId, type: "board" },
    });
    if (boarded) {
      const alreadyAlighted = await prisma.tripEvent.findFirst({
        where: { tripId: trip.id, studentId: req.params.studentId, type: "alight" },
      });
      if (!alreadyAlighted) {
        await prisma.tripEvent.create({
          data: { tripId: trip.id, studentId: req.params.studentId, type: "alight", method: "manual", manualReason: note ?? "تم الاستلام يدوياً" },
        });
      }
    }

    const openAlert = await prisma.alert.findFirst({
      where: { tripId: trip.id, busId: trip.busId, type: "student_not_collected", status: "active" },
    });
    if (openAlert) {
      const resolved = await prisma.alert.update({
        where: { id: openAlert.id },
        data: { status: "resolved", resolvedAt: new Date(), resolutionReason: note ?? "تم الاستلام" },
      });
      return res.json(resolved);
    }
    res.json({ ok: true });
  })
);

/* ---- S-07: manual entry (bracelet failure) ---- */
tripsRouter.post(
  "/trips/:id/manual-board",
  requireRole("supervisor"),
  asyncHandler(async (req, res) => {
    const trip = await loadTrip(req.params.id);
    assertSchoolAccess(req.user!, trip.schoolId);
    const { studentId, reason } = req.body ?? {};
    if (!studentId || !reason) throw badRequest("studentId and reason are required");

    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student || student.schoolId !== trip.schoolId || student.busId !== trip.busId) {
      throw badRequest("الطالب غير موجود في قائمة هذا الباص — student is not on this bus's roster");
    }
    const alreadyBoarded = await prisma.tripEvent.findFirst({
      where: { tripId: trip.id, studentId, type: "board" },
    });
    if (alreadyBoarded) throw badRequest("Student already boarded this trip");

    const event = await prisma.tripEvent.create({
      data: { tripId: trip.id, studentId, type: "board", method: "manual", manualReason: reason },
    });
    emitTripEvent(event, trip.busId, trip.schoolId);
    res.status(201).json(event);
  })
);

/* ---- S-08: live status ---- */
tripsRouter.get(
  "/trips/:id/live-status",
  asyncHandler(async (req, res) => {
    const trip = await loadTrip(req.params.id);
    assertSchoolAccess(req.user!, trip.schoolId);
    const events = await prisma.tripEvent.findMany({ where: { tripId: trip.id }, orderBy: { timestamp: "asc" } });
    res.json({ ...trip, events });
  })
);

/* ---- S-09: exception recording → high-priority alert to ops room ---- */
tripsRouter.post(
  "/trips/:id/exception",
  requireRole("supervisor"),
  asyncHandler(async (req, res) => {
    const trip = await loadTrip(req.params.id);
    assertSchoolAccess(req.user!, trip.schoolId);
    const { type, description, photoUrl } = req.body ?? {};
    if (!type || !description) throw badRequest("type and description are required");

    const alert = await prisma.alert.create({
      data: {
        schoolId: trip.schoolId,
        tripId: trip.id,
        busId: trip.busId,
        type: "exception",
        priority: "urgent",
        message: photoUrl ? `[${type}] ${description} (photo: ${photoUrl})` : `[${type}] ${description}`,
      },
    });
    emitAlertNew(alert);
    res.status(201).json(alert);
  })
);

/* ---- S-10: end trip — BLOCKED until every boarded student's exit is confirmed ---- */
tripsRouter.put(
  "/trips/:id/end",
  requireRole("supervisor"),
  asyncHandler(async (req, res) => {
    const trip = await loadTrip(req.params.id);
    assertSchoolAccess(req.user!, trip.schoolId);
    if (trip.status !== "active") throw badRequest(`Trip is not active (status: ${trip.status})`);

    const events = await prisma.tripEvent.findMany({ where: { tripId: trip.id } });
    const boarded = new Set(events.filter((e) => e.type === "board").map((e) => e.studentId));
    const alighted = new Set(events.filter((e) => e.type === "alight").map((e) => e.studentId));
    const stillOnBus = [...boarded].filter((id) => !alighted.has(id));

    if (stillOnBus.length > 0) {
      const students = await prisma.student.findMany({ where: { id: { in: stillOnBus } } });
      throw badRequest(
        `لا يزال ${stillOnBus.length} طالب لم يُسجل نزوله — cannot end trip until every boarded student's exit is confirmed`,
        { studentsStillOnBus: students.map((s) => ({ id: s.id, name: s.name, code: s.code })) }
      );
    }

    const updated = await prisma.trip.update({ where: { id: trip.id }, data: { status: "completed", endedAt: new Date() } });
    await prisma.bus.update({ where: { id: trip.busId }, data: { gpsActive: false } });
    emitTripUpdated(updated);
    res.json(updated);
  })
);

/* ---- S-11: final report ---- */
tripsRouter.get(
  "/trips/:id/report",
  asyncHandler(async (req, res) => {
    const trip = await loadTrip(req.params.id);
    assertSchoolAccess(req.user!, trip.schoolId);
    const events = await prisma.tripEvent.findMany({
      where: { tripId: trip.id },
      orderBy: { timestamp: "asc" },
      include: { student: true },
    });
    const exceptions = await prisma.alert.findMany({ where: { tripId: trip.id, type: "exception" } });
    const boarded = events.filter((e) => e.type === "board").length;
    const alighted = events.filter((e) => e.type === "alight").length;
    const durationMinutes =
      trip.startedAt && trip.endedAt ? Math.round((trip.endedAt.getTime() - trip.startedAt.getTime()) / 60000) : null;

    res.json({ trip, totalBoarded: boarded, totalAlighted: alighted, durationMinutes, events, exceptions });
  })
);

/* ---- OP-7 / p-rate-trip: a parent's post-trip rating ---- */
tripsRouter.post(
  "/trips/:id/rate",
  requireRole("parent"),
  asyncHandler(async (req, res) => {
    const trip = await loadTrip(req.params.id);
    const { stars, note } = req.body ?? {};
    if (!stars || stars < 1 || stars > 5) throw badRequest("stars (1-5) is required");

    const rating = await prisma.tripRating.create({
      data: { tripId: trip.id, parentUserId: req.user!.sub, stars, note: note ?? null },
    });

    if (trip.supervisorId && stars <= 2) {
      await prisma.alert.create({
        data: {
          schoolId: trip.schoolId, tripId: trip.id, busId: trip.busId,
          type: "exception", priority: "notice",
          message: `تقييم منخفض (${stars}★) لرحلة المشرف${note ? `: ${note}` : ""}`,
        },
      });
    }
    res.status(201).json(rating);
  })
);

/** Rolling average over the supervisor's last 30 rated trips — feeds the
 * "⭐ التقييم" figure in s-profile. */
export async function supervisorRatingAverage(supervisorId: string) {
  const recentTrips = await prisma.trip.findMany({
    where: { supervisorId, status: "completed" },
    orderBy: { endedAt: "desc" },
    take: 30,
    select: { id: true },
  });
  const ratings = await prisma.tripRating.findMany({ where: { tripId: { in: recentTrips.map((t) => t.id) } } });
  if (ratings.length === 0) return null;
  return Math.round((ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length) * 10) / 10;
}

/* ---- report POST alias (S-10 UX notes mention "رفع التقرير" right after end-trip) ---- */
tripsRouter.post(
  "/trips/:id/report",
  requireRole("supervisor"),
  asyncHandler(async (req, res) => {
    const trip = await loadTrip(req.params.id);
    assertSchoolAccess(req.user!, trip.schoolId);
    res.status(202).json({ ok: true, tripId: trip.id });
  })
);
