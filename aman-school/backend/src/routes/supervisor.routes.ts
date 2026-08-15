import { Router } from "express";
import { prisma } from "../prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { authenticate, requireRole } from "../auth/middleware";
import { badRequest, notFound, unauthorized } from "../lib/errors";
import { compareSecret, hashSecret } from "../lib/password";
import { toUserDto } from "../lib/dto";
import { supervisorRatingAverage } from "./trips.routes";

export const supervisorRouter = Router();
supervisorRouter.use(authenticate);

/* ---- S-15 / s-profile: supervisor profile + rolling safety rating ---- */
supervisorRouter.get(
  "/supervisor/:id/profile",
  requireRole("supervisor"),
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.params.id }, include: { supervisedBus: true } });
    if (!user) throw notFound("Supervisor");
    const rating = await supervisorRatingAverage(user.id);
    res.json({ ...toUserDto(user), supervisedBus: user.supervisedBus, rating });
  })
);

/* ---- S-02: today's trips for the calling supervisor's bus ---- */
supervisorRouter.get(
  "/supervisor/trips/today",
  requireRole("supervisor"),
  asyncHandler(async (req, res) => {
    const bus = await prisma.bus.findUnique({ where: { supervisorId: req.user!.sub } });
    if (!bus) return res.json([]);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const trips = await prisma.trip.findMany({
      where: { busId: bus.id, scheduledAt: { gte: startOfDay, lte: endOfDay } },
      orderBy: { scheduledAt: "asc" },
    });
    res.json(trips);
  })
);

/* ---- supervisor-history: this supervisor's own past trips (completed +
 * cancelled), most recent first, for the trip-history screen. ---- */
supervisorRouter.get(
  "/supervisor/trips/history",
  requireRole("supervisor"),
  asyncHandler(async (req, res) => {
    const trips = await prisma.trip.findMany({
      where: { supervisorId: req.user!.sub, status: { in: ["completed", "cancelled"] } },
      include: { bus: true, events: true },
      orderBy: { scheduledAt: "desc" },
      take: 60,
    });
    res.json(trips);
  })
);

/* ---- S-13: supervisor notifications ---- */
supervisorRouter.get(
  "/supervisor/:id/notifications",
  asyncHandler(async (req, res) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.params.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json(notifications);
  })
);

/* ---- S-14: settings (sound/vibration/NFC prefs, stored as free-form JSON) ---- */
supervisorRouter.put(
  "/supervisor/:id/settings",
  requireRole("supervisor"),
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) throw notFound("Supervisor");
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { notificationPrefs: req.body ?? {} },
    });
    res.json({ ok: true, notificationPrefs: updated.notificationPrefs });
  })
);

/* ---- S-14: change PIN ---- */
supervisorRouter.put(
  "/supervisor/:id/pin",
  requireRole("supervisor"),
  asyncHandler(async (req, res) => {
    if (req.user!.sub !== req.params.id) throw unauthorized();
    const { currentPin, newPin } = req.body ?? {};
    if (!currentPin || !newPin) throw badRequest("currentPin and newPin are required");
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user || !user.pinHash || !compareSecret(currentPin, user.pinHash)) {
      throw unauthorized("رمز PIN الحالي غير صحيح");
    }
    await prisma.user.update({ where: { id: req.params.id }, data: { pinHash: hashSecret(newPin) } });
    res.json({ ok: true });
  })
);
