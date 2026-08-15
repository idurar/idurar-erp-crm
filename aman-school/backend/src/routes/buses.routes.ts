import { Router } from "express";
import { prisma } from "../prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { authenticate, assertSchoolAccess, requireRole } from "../auth/middleware";
import { badRequest, notFound } from "../lib/errors";
import { distanceKm } from "../lib/geo";

export const busesRouter = Router();
busesRouter.use(authenticate);

/* ---- OP-2 / d-home: the bus currently assigned to the calling driver ---- */
busesRouter.get(
  "/drivers/me/bus",
  requireRole("driver"),
  asyncHandler(async (req, res) => {
    const bus = await prisma.bus.findUnique({
      where: { driverId: req.user!.sub },
      include: { supervisor: true, route: { include: { stops: true } } },
    });
    res.json(bus);
  })
);

/* ---- S-04: toggle GPS active flag on trip start/end ---- */
busesRouter.put(
  "/buses/:id/gps-active",
  requireRole("supervisor"),
  asyncHandler(async (req, res) => {
    const bus = await prisma.bus.findUnique({ where: { id: req.params.id } });
    if (!bus) throw notFound("Bus");
    assertSchoolAccess(req.user!, bus.schoolId);
    const { active } = req.body ?? {};
    const updated = await prisma.bus.update({ where: { id: bus.id }, data: { gpsActive: Boolean(active) } });
    res.json(updated);
  })
);

/* ---- SCH-05: link a physical GPS device to a bus ---- */
busesRouter.put(
  "/buses/:id/gps-device",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    const bus = await prisma.bus.findUnique({ where: { id: req.params.id } });
    if (!bus) throw notFound("Bus");
    assertSchoolAccess(req.user!, bus.schoolId);
    const { gpsDeviceId } = req.body ?? {};
    if (!gpsDeviceId) throw badRequest("gpsDeviceId is required");
    const updated = await prisma.bus.update({ where: { id: bus.id }, data: { gpsDeviceId } });
    res.json(updated);
  })
);

/* ---- SCH-07: define a bus's route + stops ---- */
busesRouter.post(
  "/buses/:id/route",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    const bus = await prisma.bus.findUnique({ where: { id: req.params.id } });
    if (!bus) throw notFound("Bus");
    assertSchoolAccess(req.user!, bus.schoolId);
    const { stops } = req.body ?? {};
    if (!Array.isArray(stops) || stops.length === 0) throw badRequest("stops[] is required");

    const route = await prisma.route.upsert({
      where: { busId: bus.id },
      update: {},
      create: { schoolId: bus.schoolId, busId: bus.id },
    });
    await prisma.stop.deleteMany({ where: { routeId: route.id } });
    await prisma.stop.createMany({
      data: stops.map((s: { name: string; lat: number; lng: number; radius?: number }, i: number) => ({
        routeId: route.id,
        order: i,
        name: s.name,
        lat: s.lat,
        lng: s.lng,
        radius: s.radius ?? 150,
      })),
    });
    const full = await prisma.route.findUnique({ where: { id: route.id }, include: { stops: true } });
    res.status(201).json(full);
  })
);

/* ---- SF-8: geofence/polyline settings for the route editor ---- */
busesRouter.put(
  "/buses/:id/route-settings",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    const bus = await prisma.bus.findUnique({ where: { id: req.params.id } });
    if (!bus) throw notFound("Bus");
    assertSchoolAccess(req.user!, bus.schoolId);
    const { polyline, deviationSensitivity } = req.body ?? {};
    const route = await prisma.route.findUnique({ where: { busId: bus.id } });
    if (!route) throw notFound("Route");
    const updated = await prisma.route.update({
      where: { id: route.id },
      data: { polyline: polyline ?? undefined, deviationSensitivity: deviationSensitivity ?? undefined },
      include: { stops: true },
    });
    res.json(updated);
  })
);

/* ---- OP-1.3: edit a bus / take it out of service (never hard-deleted) ---- */
busesRouter.put(
  "/buses/:id",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    const bus = await prisma.bus.findUnique({ where: { id: req.params.id } });
    if (!bus) throw notFound("Bus");
    assertSchoolAccess(req.user!, bus.schoolId);
    const { busNumber, plateNumber, capacity, supervisorId, driverId } = req.body ?? {};
    const updated = await prisma.bus.update({
      where: { id: bus.id },
      data: { busNumber, plateNumber, capacity, supervisorId, driverId },
    });
    res.json(updated);
  })
);

busesRouter.put(
  "/buses/:id/service-status",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    const bus = await prisma.bus.findUnique({ where: { id: req.params.id } });
    if (!bus) throw notFound("Bus");
    assertSchoolAccess(req.user!, bus.schoolId);
    const { outOfService, reason } = req.body ?? {};
    if (outOfService) {
      const activeTrip = await prisma.trip.findFirst({ where: { busId: bus.id, status: "active" } });
      if (activeTrip) throw badRequest("لا يمكن إخراج الباص من الخدمة أثناء رحلة نشطة");
    }
    const updated = await prisma.bus.update({
      where: { id: bus.id },
      data: { outOfService: Boolean(outOfService), outOfServiceReason: outOfService ? reason ?? null : null },
    });
    res.json(updated);
  })
);

/* ---- OP-6: fleet maintenance ---- */
busesRouter.get(
  "/buses/:id/maintenance",
  asyncHandler(async (req, res) => {
    const bus = await prisma.bus.findUnique({ where: { id: req.params.id } });
    if (!bus) throw notFound("Bus");
    assertSchoolAccess(req.user!, bus.schoolId);
    const records = await prisma.maintenanceRecord.findMany({ where: { busId: bus.id }, orderBy: { date: "desc" } });
    res.json(records);
  })
);

busesRouter.post(
  "/buses/:id/maintenance",
  requireRole("school_admin", "owner", "partner", "driver"),
  asyncHandler(async (req, res) => {
    const bus = await prisma.bus.findUnique({ where: { id: req.params.id } });
    if (!bus) throw notFound("Bus");
    assertSchoolAccess(req.user!, bus.schoolId);
    const { type, cost, workshop, notes, date } = req.body ?? {};
    if (!type) throw badRequest("type is required");
    const record = await prisma.maintenanceRecord.create({
      data: { busId: bus.id, type, cost: cost ?? null, workshop: workshop ?? null, notes: notes ?? null, date: date ? new Date(date) : new Date() },
    });
    if (type === "routine") {
      await prisma.bus.update({ where: { id: bus.id }, data: { lastMaintenanceAt: new Date() } });
    }
    res.status(201).json(record);
  })
);

busesRouter.put(
  "/buses/:id/maintenance-dates",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    const bus = await prisma.bus.findUnique({ where: { id: req.params.id } });
    if (!bus) throw notFound("Bus");
    assertSchoolAccess(req.user!, bus.schoolId);
    const { inspectionExpiresAt, insuranceExpiresAt } = req.body ?? {};
    const updated = await prisma.bus.update({
      where: { id: bus.id },
      data: {
        inspectionExpiresAt: inspectionExpiresAt ? new Date(inspectionExpiresAt) : undefined,
        insuranceExpiresAt: insuranceExpiresAt ? new Date(insuranceExpiresAt) : undefined,
      },
    });
    res.json(updated);
  })
);

/* ---- P-07: ETA — distance/speed estimate from the bus's current GPS fix to its next stop ---- */
busesRouter.get(
  "/buses/:id/eta",
  asyncHandler(async (req, res) => {
    const bus = await prisma.bus.findUnique({
      where: { id: req.params.id },
      include: { route: { include: { stops: true } } },
    });
    if (!bus) throw notFound("Bus");
    assertSchoolAccess(req.user!, bus.schoolId);

    const stops = bus.route?.stops.slice().sort((a, b) => a.order - b.order) ?? [];
    if (!bus.gpsActive || bus.currentLat == null || bus.currentLng == null || stops.length === 0) {
      return res.json({ etaMinutes: null, distanceKm: null, stopsBefore: null, status: "الرحلة لم تبدأ بعد" });
    }

    const activeTrip = await prisma.trip.findFirst({ where: { busId: bus.id, status: "active" } });
    const fromIdx = Math.min(activeTrip?.simStopIndex ?? 0, stops.length - 1);
    const remainingStops = stops.slice(fromIdx + 1);
    const lastStop = stops[stops.length - 1];

    const dist = distanceKm(bus.currentLat, bus.currentLng, lastStop.lat, lastStop.lng);
    const assumedSpeedKmh = bus.currentSpeedKmh && bus.currentSpeedKmh > 5 ? bus.currentSpeedKmh : 25;
    const etaMinutes = Math.max(1, Math.round((dist / assumedSpeedKmh) * 60));

    res.json({ etaMinutes, distanceKm: Math.round(dist * 10) / 10, stopsBefore: remainingStops.length });
  })
);
