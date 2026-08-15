import { Router } from "express";
import { prisma } from "../prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { authenticate, requireRole } from "../auth/middleware";

export const regulatorRouter = Router();
regulatorRouter.use(authenticate);
regulatorRouter.use(requireRole("regulator"));

/* ---- Platform-wide, read-only oversight for regulatory/licensing
 * authorities — no writes, no tenant scoping (they see everything, but can
 * change nothing). ---- */

regulatorRouter.get(
  "/regulator/overview",
  asyncHandler(async (_req, res) => {
    const [totalSchools, totalStudents, totalBuses, activeIncidents, resolvedIncidents30d] = await Promise.all([
      prisma.school.count(),
      prisma.student.count({ where: { status: "active" } }),
      prisma.bus.count({ where: { outOfService: false } }),
      prisma.alert.count({ where: { status: "active" } }),
      prisma.alert.count({ where: { status: "resolved", resolvedAt: { gte: new Date(Date.now() - 30 * 86400000) } } }),
    ]);
    res.json({ totalSchools, totalStudents, totalBuses, activeIncidents, resolvedIncidents30d });
  })
);

regulatorRouter.get(
  "/regulator/schools",
  asyncHandler(async (_req, res) => {
    const schools = await prisma.school.findMany({
      include: {
        _count: { select: { students: true, buses: true } },
      },
      orderBy: { name: "asc" },
    });
    const incidentCounts = await prisma.alert.groupBy({
      by: ["schoolId"],
      where: { createdAt: { gte: new Date(Date.now() - 90 * 86400000) } },
      _count: true,
    });
    const incidentBySchool = new Map(incidentCounts.map((c) => [c.schoolId, c._count]));
    res.json(
      schools.map((s) => ({
        id: s.id,
        name: s.name,
        address: s.address,
        licenseNumber: s.licenseNumber,
        subscriptionStatus: s.subscriptionStatus,
        studentsCount: s._count.students,
        busesCount: s._count.buses,
        incidents90d: incidentBySchool.get(s.id) ?? 0,
        createdAt: s.createdAt,
      }))
    );
  })
);

regulatorRouter.get(
  "/regulator/incidents",
  asyncHandler(async (req, res) => {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const incidents = await prisma.alert.findMany({
      where: status ? { status: status as any } : undefined,
      include: { school: { select: { name: true } }, bus: { select: { busNumber: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    res.json(incidents);
  })
);
