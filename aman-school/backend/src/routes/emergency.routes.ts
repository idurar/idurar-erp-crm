import { Router } from "express";
import { prisma } from "../prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { authenticate, requireRole } from "../auth/middleware";
import { badRequest } from "../lib/errors";
import { emitAlertNew } from "../sockets/gateway";

export const emergencyRouter = Router();
emergencyRouter.use(authenticate);

/* ---- S-12 / P-11: SOS — dual channel per spec (API here; SMS fallback logged
 * since there's no real SMS gateway in this environment — see notes below). */
emergencyRouter.post(
  "/emergency/sos",
  requireRole("supervisor", "parent", "driver"),
  asyncHandler(async (req, res) => {
    const { tripId, lat, lng, description } = req.body ?? {};
    if (lat == null || lng == null) throw badRequest("lat and lng are required");

    let schoolId = req.user!.schoolId;
    let busId: string | null = null;
    if (tripId) {
      const trip = await prisma.trip.findUnique({ where: { id: tripId } });
      if (trip) {
        schoolId = trip.schoolId;
        busId = trip.busId;
      }
    }
    if (!schoolId) throw badRequest("Unable to resolve school for this SOS (no active trip/school context)");

    const alert = await prisma.alert.create({
      data: {
        schoolId,
        tripId: tripId ?? null,
        busId,
        type: "sos",
        priority: "urgent_critical",
        message: description ?? `SOS from ${req.user!.role} at (${lat}, ${lng})`,
      },
    });

    // Real hardware/production would also send an SMS fallback with location
    // when offline — no SMS gateway is wired up in this dev environment, so we
    // log the equivalent "SMS fallback" line instead (see docs/screens
    // supervisor/S-12 and parent/P-11 UX notes).
    console.log(`[dev-sms-fallback] SOS location for school ${schoolId}: (${lat}, ${lng})`);

    emitAlertNew(alert);
    res.status(201).json(alert);
  })
);
