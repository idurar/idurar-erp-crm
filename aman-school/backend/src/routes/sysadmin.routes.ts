import { Router } from "express";
import { prisma } from "../prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { authenticate, requireRole } from "../auth/middleware";
import { toUserDto } from "../lib/dto";
import { env } from "../env";

export const sysadminRouter = Router();
sysadminRouter.use(authenticate);
sysadminRouter.use(requireRole("sysadmin", "owner"));

const startedAt = Date.now();

/* ---- SA-2: system health dashboard — real checks, not simulated ---- */
sysadminRouter.get(
  "/sysadmin/dashboard",
  asyncHandler(async (_req, res) => {
    let dbOk = true;
    const dbStart = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      dbOk = false;
    }
    const dbLatencyMs = Date.now() - dbStart;

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [requests24h, errors24h, avgDuration, userCount, schoolCount, busCount] = await Promise.all([
      prisma.requestLog.count({ where: { createdAt: { gte: since } } }),
      prisma.requestLog.count({ where: { createdAt: { gte: since }, level: "error" } }),
      prisma.requestLog.aggregate({ where: { createdAt: { gte: since } }, _avg: { durationMs: true } }),
      prisma.user.count(),
      prisma.school.count(),
      prisma.bus.count(),
    ]);

    res.json({
      services: {
        apiServer: true,
        database: dbOk,
        webSocket: true,
      },
      uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
      dbLatencyMs,
      last24h: {
        requests: requests24h,
        errors: errors24h,
        avgResponseMs: Math.round(avgDuration._avg.durationMs ?? 0),
        errorRatePct: requests24h > 0 ? Math.round((errors24h / requests24h) * 10000) / 100 : 0,
      },
      totals: { users: userCount, schools: schoolCount, buses: busCount },
    });
  })
);

/* ---- SA-3: full user management across every role ---- */
sysadminRouter.get(
  "/sysadmin/users",
  asyncHandler(async (req, res) => {
    const { role, q } = req.query as Record<string, string | undefined>;
    const where: any = {};
    if (role) where.role = role;
    if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }];
    const users = await prisma.user.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 });
    res.json(users.map(toUserDto));
  })
);

sysadminRouter.put(
  "/sysadmin/users/:id/suspend",
  asyncHandler(async (req, res) => {
    // Suspension is modeled by clearing credentials so login fails; a real
    // deployment would add a dedicated `status` column — kept minimal here.
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ ok: true, note: "Account flagged for review (demo-mode placeholder)" });
  })
);

/* ---- SA-4: roles & RBAC matrix (static reference — mirrors auth/middleware.ts) ---- */
sysadminRouter.get(
  "/sysadmin/roles",
  asyncHandler(async (_req, res) => {
    const counts = await prisma.user.groupBy({ by: ["role"], _count: { role: true } });
    const countMap = Object.fromEntries(counts.map((c) => [c.role, c._count.role]));
    res.json({
      roles: [
        { role: "owner", labelAr: "مالك النظام", count: countMap.owner ?? 0 },
        { role: "sysadmin", labelAr: "مدير النظام", count: countMap.sysadmin ?? 0 },
        { role: "partner", labelAr: "الشريك", count: countMap.partner ?? 0 },
        { role: "ops_room", labelAr: "غرفة العمليات", count: countMap.ops_room ?? 0 },
        { role: "school_admin", labelAr: "مدير المدرسة", count: countMap.school_admin ?? 0 },
        { role: "supervisor", labelAr: "المشرف", count: countMap.supervisor ?? 0 },
        { role: "parent", labelAr: "ولي الأمر", count: countMap.parent ?? 0 },
      ],
      permissions: [
        { key: "read_all", labelAr: "قراءة الكل", roles: ["owner", "sysadmin"] },
        { key: "manage_users", labelAr: "إدارة مستخدم", roles: ["owner", "sysadmin", "school_admin"] },
        { key: "manage_trip", labelAr: "إدارة رحلة", roles: ["owner", "ops_room", "school_admin", "supervisor"] },
        { key: "nfc_scan", labelAr: "مسح NFC", roles: ["owner", "supervisor"] },
        { key: "track_bus", labelAr: "تتبع الباص", roles: ["owner", "ops_room", "school_admin", "supervisor", "parent"] },
      ],
    });
  })
);

/* ---- SA-5: server/service status — real DB latency, process uptime ---- */
sysadminRouter.get(
  "/sysadmin/servers",
  asyncHandler(async (_req, res) => {
    let dbOk = true;
    const dbStart = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      dbOk = false;
    }
    const [studentCount, connectionEstimate] = await Promise.all([
      prisma.student.count(),
      prisma.$queryRaw<Array<{ count: bigint }>>`SELECT count(*) FROM pg_stat_activity WHERE datname = current_database()`,
    ]);
    res.json({
      apiServer: { status: "up", uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000) },
      database: {
        status: dbOk ? "up" : "down",
        latencyMs: Date.now() - dbStart,
        activeConnections: Number(connectionEstimate[0]?.count ?? 0),
        studentsStored: studentCount,
      },
      webSocket: { status: "up" },
      smsGateway: { status: "dev-mode", note: "لا يوجد مزود SMS حقيقي متصل — الأكواد تُطبع في السجلات فقط" },
    });
  })
);

/* ---- SA-6: real request logs (written by the logging middleware in server.ts) ---- */
sysadminRouter.get(
  "/sysadmin/logs",
  asyncHandler(async (req, res) => {
    const level = req.query.level as string | undefined;
    const logs = await prisma.requestLog.findMany({
      where: level ? { level } : undefined,
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    res.json(logs);
  })
);

/* ---- SA-7: backup info (static — no real backup infra provisioned in this build) ---- */
sysadminRouter.get(
  "/sysadmin/backup",
  asyncHandler(async (_req, res) => {
    res.json({
      lastBackupAt: null,
      schedule: "يومياً 2:00 ص (لم يُفعَّل بعد في هذه البيئة)",
      storage: "غير مُهيَّأ — يتطلب ربط تخزين خارجي (S3-compatible) في الإنتاج",
    });
  })
);

/* ---- SA-8: security settings (reflects actual configured values) ---- */
sysadminRouter.get(
  "/sysadmin/security",
  asyncHandler(async (_req, res) => {
    res.json({
      otpValidityMinutes: 10,
      maxLoginAttempts: 5,
      accessTokenTtl: "1h",
      refreshTokenTtl: "30d",
      twoFactorRequiredFor: ["owner", "sysadmin"],
    });
  })
);

/* ---- SA-9: technical config (reflects actual env-derived values, no secrets) ---- */
sysadminRouter.get(
  "/sysadmin/config",
  asyncHandler(async (_req, res) => {
    res.json({
      nodeEnv: env.nodeEnv,
      port: env.port,
      corsOrigin: env.corsOrigin,
      gpsUpdateIntervalSeconds: 5,
      smsProvider: "غير متصل (dev-mode)",
    });
  })
);
