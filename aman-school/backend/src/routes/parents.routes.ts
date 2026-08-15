import { Router } from "express";
import { prisma } from "../prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { authenticate, requireRole } from "../auth/middleware";
import { badRequest, forbidden, notFound } from "../lib/errors";

export const parentsRouter = Router();
parentsRouter.use(authenticate);

/* ---- P-04/P-12: link a student to the calling parent's account by code.
 * Deliberately allowed across schools — see docs/architecture/01-multi-tenant-design.md. */
parentsRouter.post(
  "/parents/students/link",
  requireRole("parent"),
  asyncHandler(async (req, res) => {
    const { studentCode } = req.body ?? {};
    if (!studentCode) throw badRequest("studentCode is required");

    const student = await prisma.student.findUnique({ where: { code: studentCode } });
    if (!student) throw badRequest("الكود غير صحيح — student code not found");

    const existingLink = await prisma.studentParentLink.findFirst({ where: { studentId: student.id } });
    if (existingLink && existingLink.parentUserId !== req.user!.sub) {
      throw forbidden("هذا الطالب مرتبط بحساب آخر — student is already linked to another account");
    }

    await prisma.studentParentLink.upsert({
      where: { studentId_parentUserId: { studentId: student.id, parentUserId: req.user!.sub } },
      update: {},
      create: { studentId: student.id, parentUserId: req.user!.sub, schoolId: student.schoolId },
    });

    res.status(201).json(student);
  })
);

/* ---- P-05: home dashboard — status for every linked child, across schools ---- */
parentsRouter.get(
  "/parents/:id/children/status",
  asyncHandler(async (req, res) => {
    if (req.user!.role === "parent" && req.user!.sub !== req.params.id) throw forbidden();

    const links = await prisma.studentParentLink.findMany({
      where: { parentUserId: req.params.id },
      include: { student: { include: { bus: true, school: true } } },
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const results = await Promise.all(
      links.map(async ({ student }) => {
        const lastEvent = await prisma.tripEvent.findFirst({
          where: { studentId: student.id, timestamp: { gte: startOfDay } },
          orderBy: { timestamp: "desc" },
          include: { trip: true },
        });
        let status: "home" | "on_the_way" | "at_school" = "home";
        if (lastEvent) {
          status = lastEvent.type === "board" ? "on_the_way" : lastEvent.trip.direction === "to_school" ? "at_school" : "home";
        }
        return { ...student, status, lastUpdate: lastEvent?.timestamp ?? null };
      })
    );

    res.json(results);
  })
);

/* ---- P-09: notification center ---- */
parentsRouter.get(
  "/parents/:id/notifications",
  asyncHandler(async (req, res) => {
    if (req.user!.role === "parent" && req.user!.sub !== req.params.id) throw forbidden();
    const notifications = await prisma.notification.findMany({
      where: { userId: req.params.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json(notifications);
  })
);

/* ---- P-10: notification preferences (free-form JSON: per-type toggles + quiet hours) ---- */
parentsRouter.put(
  "/parents/:id/notification-prefs",
  requireRole("parent"),
  asyncHandler(async (req, res) => {
    if (req.user!.sub !== req.params.id) throw forbidden();
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) throw notFound("Parent");
    const updated = await prisma.user.update({ where: { id: req.params.id }, data: { notificationPrefs: req.body ?? {} } });
    res.json({ ok: true, notificationPrefs: updated.notificationPrefs });
  })
);

/* ---- P-11: contact / support ---- */
parentsRouter.post(
  "/support/contact",
  asyncHandler(async (req, res) => {
    const { message, channel } = req.body ?? {};
    if (!message) throw badRequest("message is required");
    const record = await prisma.supportMessage.create({
      data: { userId: req.user!.sub, message, channel: channel ?? "app" },
    });
    res.status(201).json(record);
  })
);
