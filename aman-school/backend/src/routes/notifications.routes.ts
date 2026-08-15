import { Router } from "express";
import { prisma } from "../prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { authenticate } from "../auth/middleware";
import { forbidden, notFound } from "../lib/errors";

export const notificationsRouter = Router();
notificationsRouter.use(authenticate);

/* ---- generic notifications + prefs for roles with no bespoke endpoint
 * (driver, ops_room, sysadmin, owner, partner) — mirrors the per-role
 * patterns already used by supervisor/parent/owner. ---- */
notificationsRouter.get(
  "/notifications/mine",
  asyncHandler(async (req, res) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.sub },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json(notifications);
  })
);

notificationsRouter.put(
  "/users/me/notification-prefs",
  asyncHandler(async (req, res) => {
    const updated = await prisma.user.update({
      where: { id: req.user!.sub },
      data: { notificationPrefs: req.body ?? {} },
    });
    res.json({ ok: true, notificationPrefs: updated.notificationPrefs });
  })
);

notificationsRouter.put(
  "/notifications/:id/read",
  asyncHandler(async (req, res) => {
    const notification = await prisma.notification.findUnique({ where: { id: req.params.id } });
    if (!notification) throw notFound("Notification");
    if (notification.userId !== req.user!.sub) throw forbidden();
    const updated = await prisma.notification.update({ where: { id: notification.id }, data: { read: true } });
    res.json(updated);
  })
);
