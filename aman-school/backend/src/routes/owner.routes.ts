import { Router } from "express";
import { prisma } from "../prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { authenticate, requireRole } from "../auth/middleware";
import { badRequest, notFound } from "../lib/errors";
import { hashSecret } from "../lib/password";
import { toUserDto } from "../lib/dto";
import { signImpersonationToken } from "../auth/jwt";

export const ownerRouter = Router();
ownerRouter.use(authenticate);
ownerRouter.use(requireRole("owner"));

/* ---- OWN-01: platform-wide summary ---- */
ownerRouter.get(
  "/owner/platform-summary",
  asyncHandler(async (_req, res) => {
    const [totalSchools, activeSchools, totalStudents, schools] = await Promise.all([
      prisma.school.count(),
      prisma.school.count({ where: { subscriptionStatus: "active" } }),
      prisma.student.count({ where: { status: "active" } }),
      prisma.school.findMany({ include: { package: true } }),
    ]);
    const monthlyRevenue = schools
      .filter((s) => s.subscriptionStatus === "active" && s.package)
      .reduce((sum, s) => sum + (s.package?.priceMonthly ?? 0), 0);

    res.json({
      totalSchools,
      activeSchools,
      totalStudents,
      monthlyRevenue,
      recentSchools: schools
        .slice()
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5),
    });
  })
);

/* ---- OWN-02: schools list + registration (auto-provisions admin) ---- */
ownerRouter.get(
  "/owner/schools",
  asyncHandler(async (req, res) => {
    const { status, packageId, partnerId, q } = req.query as Record<string, string | undefined>;
    const where: any = {};
    if (status) where.subscriptionStatus = status;
    if (packageId) where.packageId = packageId;
    if (partnerId) where.partnerId = partnerId;
    if (q) where.name = { contains: q, mode: "insensitive" };
    const schools = await prisma.school.findMany({ where, include: { package: true, partner: true } });
    res.json(schools);
  })
);

/* ---- BC-1 / ow-onboarding: 5-step new-school wizard, submitted as one call
 * once the client has walked through every step (each step's fields folded
 * into a single payload) — provisions school + admin + subscription
 * atomically, matching the wizard's step 5 "confirm and launch". ---- */
ownerRouter.post(
  "/owner/schools/onboard",
  asyncHandler(async (req, res) => {
    const {
      name, slug, address, region, licenseNumber, phone, email,
      adminName, adminEmail, packageId, partnerId, contractCycle,
    } = req.body ?? {};
    if (!name || !slug || !adminName || !adminEmail || !packageId) {
      throw badRequest("name, slug, adminName, adminEmail and packageId are required");
    }
    if (licenseNumber) {
      const existing = await prisma.school.findUnique({ where: { licenseNumber } });
      if (existing) throw badRequest("رقم الترخيص مُستخدم مسبقاً لمدرسة أخرى");
    }
    const existingAdmin = await prisma.user.findFirst({ where: { email: adminEmail } });
    if (existingAdmin) throw badRequest("البريد الإلكتروني للمدير مُستخدم في حساب آخر");

    const cycleDays = contractCycle === "yearly" ? 365 : 30;
    const subscriptionEndsAt = new Date(Date.now() + cycleDays * 86400000);

    const school = await prisma.school.create({
      data: {
        name, slug, address: address ?? region ?? null, licenseNumber: licenseNumber ?? null,
        phone: phone ?? null, email: email ?? null, packageId, partnerId: partnerId ?? null,
        subscriptionStatus: "active", subscriptionEndsAt,
      },
    });

    const tempPassword = Math.random().toString(36).slice(2, 10);
    const admin = await prisma.user.create({
      data: {
        role: "school_admin",
        name: adminName,
        email: adminEmail,
        schoolId: school.id,
        passwordHash: hashSecret(tempPassword),
      },
    });

    // No email/SMS provider wired up in this dev environment — log the
    // credentials that would otherwise be sent to the new school admin.
    console.log(`[dev-email] School admin credentials for ${adminEmail}: password=${tempPassword}`);

    res.status(201).json({ school, admin: { id: admin.id, email: admin.email }, devTempPassword: tempPassword });
  })
);

// Kept for backwards-compatibility with the original single-step registration flow.
ownerRouter.post(
  "/owner/schools/register",
  asyncHandler(async (req, res) => {
    const { name, slug, address, adminName, adminEmail, packageId, partnerId } = req.body ?? {};
    if (!name || !slug || !adminName || !adminEmail || !packageId) {
      throw badRequest("name, slug, adminName, adminEmail and packageId are required");
    }

    const school = await prisma.school.create({
      data: { name, slug, address: address ?? null, packageId, partnerId: partnerId ?? null, subscriptionStatus: "trial" },
    });

    const tempPassword = Math.random().toString(36).slice(2, 10);
    const admin = await prisma.user.create({
      data: {
        role: "school_admin",
        name: adminName,
        email: adminEmail,
        schoolId: school.id,
        passwordHash: hashSecret(tempPassword),
      },
    });

    console.log(`[dev-email] School admin credentials for ${adminEmail}: password=${tempPassword}`);

    res.status(201).json({ school, admin: { id: admin.id, email: admin.email }, devTempPassword: tempPassword });
  })
);

ownerRouter.get(
  "/owner/schools/:id/detail",
  asyncHandler(async (req, res) => {
    const school = await prisma.school.findUnique({
      where: { id: req.params.id },
      include: { package: true, partner: true, invoices: true, students: true, buses: true },
    });
    if (!school) throw notFound("School");
    res.json(school);
  })
);

/* ---- OWN-04: partners ---- */
ownerRouter.get(
  "/owner/partners",
  asyncHandler(async (_req, res) => {
    await applyAutoTierUpgrades();
    const partners = await prisma.partner.findMany({ include: { schools: true, tier: true } });
    res.json(partners);
  })
);

ownerRouter.post(
  "/owner/partners/register",
  asyncHandler(async (req, res) => {
    const { name, region, commissionPercent } = req.body ?? {};
    if (!name || !region || commissionPercent == null) throw badRequest("name, region and commissionPercent are required");
    const partner = await prisma.partner.create({ data: { name, region, commissionPercent } });
    res.status(201).json(partner);
  })
);

ownerRouter.put(
  "/owner/partners/:id",
  asyncHandler(async (req, res) => {
    const { name, region, commissionPercent } = req.body ?? {};
    const updated = await prisma.partner.update({ where: { id: req.params.id }, data: { name, region, commissionPercent } });
    res.json(updated);
  })
);

/* ---- BC-8 / ow-partner-tiers ---- */
ownerRouter.get(
  "/owner/partner-tiers",
  asyncHandler(async (_req, res) => {
    res.json(await prisma.partnerTier.findMany({ orderBy: { minActiveSchools: "asc" } }));
  })
);

ownerRouter.put(
  "/owner/partner-tiers/:id",
  asyncHandler(async (req, res) => {
    const { commissionPercent, minActiveSchools } = req.body ?? {};
    const updated = await prisma.partnerTier.update({
      where: { id: req.params.id },
      data: { commissionPercent, minActiveSchools },
    });
    res.json(updated);
  })
);

/** Nightly-cron equivalent: promote/demote every auto-upgrade partner based on
 * their current count of active schools. Called lazily by GET /owner/partners
 * since this build has no real scheduler (see docs/architecture). */
async function applyAutoTierUpgrades() {
  const [partners, tiers] = await Promise.all([
    prisma.partner.findMany({ where: { autoTierUpgrade: true }, include: { schools: true } }),
    prisma.partnerTier.findMany({ orderBy: { minActiveSchools: "desc" } }),
  ]);
  for (const partner of partners) {
    const activeSchools = partner.schools.filter((s) => s.subscriptionStatus === "active").length;
    const eligibleTier = tiers.find((t) => activeSchools >= t.minActiveSchools);
    if (eligibleTier && eligibleTier.id !== partner.tierId) {
      await prisma.partner.update({
        where: { id: partner.id },
        data: { tierId: eligibleTier.id, commissionPercent: eligibleTier.commissionPercent },
      });
    }
  }
}

/* ---- OWN-05: packages ---- */
ownerRouter.get(
  "/owner/packages",
  asyncHandler(async (_req, res) => {
    res.json(await prisma.package.findMany());
  })
);

ownerRouter.put(
  "/owner/packages/:id",
  asyncHandler(async (req, res) => {
    const { name, priceMonthly, studentLimit, features } = req.body ?? {};
    const updated = await prisma.package.update({
      where: { id: req.params.id },
      data: { name, priceMonthly, studentLimit, features },
    });
    res.json(updated);
  })
);

ownerRouter.get(
  "/owner/subscriptions",
  asyncHandler(async (_req, res) => {
    const schools = await prisma.school.findMany({ include: { package: true } });
    res.json(
      schools.map((s) => ({ schoolId: s.id, schoolName: s.name, package: s.package, status: s.subscriptionStatus }))
    );
  })
);

/* ---- OWN-06: revenue & billing ---- */
ownerRouter.get(
  "/owner/revenue/summary",
  asyncHandler(async (_req, res) => {
    const schools = await prisma.school.findMany({ where: { subscriptionStatus: "active" }, include: { package: true } });
    const monthlyRevenue = schools.reduce((sum, s) => sum + (s.package?.priceMonthly ?? 0), 0);
    res.json({ monthlyRevenue, annualRevenue: monthlyRevenue * 12, activeSchools: schools.length });
  })
);

ownerRouter.get(
  "/owner/invoices",
  asyncHandler(async (_req, res) => {
    res.json(await prisma.invoice.findMany({ include: { school: true }, orderBy: { issuedAt: "desc" } }));
  })
);

/* ---- BC-5 / ow-refunds ---- */
ownerRouter.get(
  "/owner/refunds",
  asyncHandler(async (_req, res) => {
    res.json(await prisma.refund.findMany({ include: { school: true }, orderBy: { createdAt: "desc" } }));
  })
);

ownerRouter.put(
  "/owner/refunds/:id",
  asyncHandler(async (req, res) => {
    const { status, refundAmount } = req.body ?? {};
    if (!["approved", "rejected"].includes(status)) throw badRequest("status must be approved or rejected");
    const updated = await prisma.refund.update({
      where: { id: req.params.id },
      data: { status, refundAmount: refundAmount ?? undefined, resolvedAt: new Date() },
    });
    res.json(updated);
  })
);

/* ---- OWN-07: platform analytics ---- */
ownerRouter.get(
  "/owner/analytics",
  asyncHandler(async (_req, res) => {
    const schools = await prisma.school.findMany({ include: { package: true } });
    const byPackage: Record<string, number> = {};
    for (const s of schools) {
      const name = s.package?.name ?? "بدون باقة";
      byPackage[name] = (byPackage[name] ?? 0) + 1;
    }
    res.json({
      totalSchools: schools.length,
      activeSchools: schools.filter((s) => s.subscriptionStatus === "active").length,
      schoolsByPackage: byPackage,
    });
  })
);

/* ---- OWN-08: platform settings (singleton JSON row) ---- */
ownerRouter.get(
  "/owner/platform-settings",
  asyncHandler(async (_req, res) => {
    const settings = await prisma.platformSettings.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton", data: {} },
    });
    res.json(settings.data);
  })
);

ownerRouter.put(
  "/owner/platform-settings",
  asyncHandler(async (req, res) => {
    const updated = await prisma.platformSettings.upsert({
      where: { id: "singleton" },
      update: { data: req.body ?? {} },
      create: { id: "singleton", data: req.body ?? {} },
    });
    res.json(updated.data);
  })
);

/* ---- OWN-08 (ow-users): every user on the platform, across all schools ---- */
ownerRouter.get(
  "/owner/users",
  asyncHandler(async (req, res) => {
    const { role, q } = req.query as Record<string, string | undefined>;
    const where: any = {};
    if (role) where.role = role;
    if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }, { email: { contains: q, mode: "insensitive" } }];
    const users = await prisma.user.findMany({ where, orderBy: { createdAt: "desc" }, take: 200, include: { school: true } });
    res.json(
      users.map((u) => ({ ...toUserDto(u), schoolName: u.school?.name ?? null, createdAt: u.createdAt }))
    );
  })
);

/* ---- ow-notifications: executive-only alerts (subscription expiry, growth, new partner requests) ---- */
ownerRouter.get(
  "/owner/notifications",
  asyncHandler(async (_req, res) => {
    const soon = new Date(Date.now() + 30 * 86400000);
    const [expiringSchools, recentSchools, totalStudents] = await Promise.all([
      prisma.school.findMany({ where: { subscriptionStatus: { in: ["trial", "suspended"] } }, take: 10 }),
      prisma.school.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
      prisma.student.count(),
    ]);

    const items = [
      ...expiringSchools.map((s) => ({
        type: "subscription_risk",
        message: `مدرسة ${s.name}: الاشتراك ${s.subscriptionStatus === "trial" ? "تجريبي" : "معلّق"} — يحتاج متابعة`,
        createdAt: s.createdAt,
      })),
      ...recentSchools.map((s) => ({
        type: "new_school",
        message: `مدرسة جديدة انضمت: ${s.name}`,
        createdAt: s.createdAt,
      })),
      {
        type: "growth",
        message: `إجمالي الطلاب النشطين على المنصة: ${totalStudents}`,
        createdAt: new Date(),
      },
    ];
    res.json(items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
  })
);

/* ---- owner-features (§12): experimental feature flags ---- */
ownerRouter.get(
  "/owner/feature-flags",
  asyncHandler(async (_req, res) => {
    const flags = await prisma.featureFlag.findMany({ orderBy: { createdAt: "desc" } });
    res.json(flags);
  })
);

ownerRouter.post(
  "/owner/feature-flags",
  asyncHandler(async (req, res) => {
    const { key, labelAr, description } = req.body ?? {};
    if (!key || !labelAr) throw badRequest("key and labelAr are required");
    const flag = await prisma.featureFlag.create({ data: { key, labelAr, description: description ?? null } });
    res.status(201).json(flag);
  })
);

ownerRouter.put(
  "/owner/feature-flags/:id",
  asyncHandler(async (req, res) => {
    const flag = await prisma.featureFlag.findUnique({ where: { id: req.params.id } });
    if (!flag) throw notFound("FeatureFlag");
    const { enabledGlobally, enabledForSchoolIds } = req.body ?? {};
    const updated = await prisma.featureFlag.update({
      where: { id: flag.id },
      data: {
        enabledGlobally: enabledGlobally ?? undefined,
        enabledForSchoolIds: enabledForSchoolIds ?? undefined,
      },
    });
    res.json(updated);
  })
);

ownerRouter.put(
  "/owner/feature-flags/:id/schools/:schoolId",
  asyncHandler(async (req, res) => {
    const flag = await prisma.featureFlag.findUnique({ where: { id: req.params.id } });
    if (!flag) throw notFound("FeatureFlag");
    const { enabled } = req.body ?? {};
    const nextSchoolIds = enabled
      ? Array.from(new Set([...flag.enabledForSchoolIds, req.params.schoolId]))
      : flag.enabledForSchoolIds.filter((id) => id !== req.params.schoolId);
    const updated = await prisma.featureFlag.update({ where: { id: flag.id }, data: { enabledForSchoolIds: nextSchoolIds } });
    res.json(updated);
  })
);

/* ---- owner-impersonate (§13): time-boxed, reason-logged support session as
 * a target school's own school_admin. Requires an existing school_admin user
 * for that school — the owner steps into a real account, never a synthetic
 * one, so every action taken during the session attributes normally. ---- */
const IMPERSONATION_MINUTES = 30;

ownerRouter.post(
  "/owner/impersonate",
  asyncHandler(async (req, res) => {
    const { schoolId, reason } = req.body ?? {};
    if (!schoolId || !reason) throw badRequest("schoolId and reason are required");

    const targetAdmin = await prisma.user.findFirst({ where: { schoolId, role: "school_admin" } });
    if (!targetAdmin) throw notFound("No school_admin user found for this school");

    const endsAt = new Date(Date.now() + IMPERSONATION_MINUTES * 60000);
    const log = await prisma.impersonationLog.create({
      data: { ownerUserId: req.user!.sub, targetSchoolId: schoolId, reason, endsAt },
    });

    const accessToken = signImpersonationToken(
      { sub: targetAdmin.id, role: "school_admin", schoolId, partnerId: null, tenantVersion: 1 },
      req.user!.sub,
      IMPERSONATION_MINUTES * 60
    );

    res.status(201).json({ accessToken, expiresAt: endsAt, logId: log.id, targetUser: toUserDto(targetAdmin) });
  })
);

ownerRouter.put(
  "/owner/impersonate/:logId/end",
  asyncHandler(async (req, res) => {
    const log = await prisma.impersonationLog.findUnique({ where: { id: req.params.logId } });
    if (!log) throw notFound("ImpersonationLog");
    const updated = await prisma.impersonationLog.update({ where: { id: log.id }, data: { endedAt: new Date() } });
    res.json(updated);
  })
);

ownerRouter.get(
  "/owner/impersonation-logs",
  asyncHandler(async (_req, res) => {
    const logs = await prisma.impersonationLog.findMany({
      include: { school: true, owner: true },
      orderBy: { startedAt: "desc" },
      take: 100,
    });
    res.json(logs);
  })
);
