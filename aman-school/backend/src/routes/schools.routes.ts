import { Router } from "express";
import multer from "multer";
import * as XLSX from "xlsx";
import { prisma } from "../prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { authenticate, assertSchoolAccess, requireRole } from "../auth/middleware";
import { badRequest, notFound } from "../lib/errors";
import { hashSecret } from "../lib/password";
import { randomDigits, randomEmployeeCode, randomDriverCode } from "../lib/codes";
import { toUserDto } from "../lib/dto";
import { nextStudentCode } from "./students.routes";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const IMPORT_COLUMNS = ["الاسم الكامل", "رقم الهوية", "الصف", "الشعبة", "الباص", "المحطة", "اسم ولي الأمر", "جوال ولي الأمر", "ملاحظات طبية"];

export const schoolsRouter = Router();
schoolsRouter.use(authenticate);

/** BC-3/BC-4 lazy lifecycle transition — no real cron scheduler in this build,
 * so a school's status is brought up to date whenever it's fetched: active →
 * grace_period once subscriptionEndsAt passes, then restricted/suspended once
 * the grace window (from ow-sub-lifecycle policy) also passes. */
async function applySubscriptionLifecycle(school: { id: string; subscriptionStatus: string; subscriptionEndsAt: Date | null; gracePeriodEndsAt: Date | null }) {
  if (!school.subscriptionEndsAt) return school;
  const now = new Date();

  if (school.subscriptionStatus === "active" && now > school.subscriptionEndsAt) {
    const settings = await prisma.platformSettings.findUnique({ where: { id: "singleton" } });
    const policy = (settings?.data as any)?.subscriptionLifecyclePolicy ?? { schoolGraceDays: 7, postGraceAction: "restricted" };
    const gracePeriodEndsAt = new Date(school.subscriptionEndsAt.getTime() + (policy.schoolGraceDays ?? 7) * 86400000);
    return prisma.school.update({ where: { id: school.id }, data: { subscriptionStatus: "grace_period", gracePeriodEndsAt } });
  }

  if (school.subscriptionStatus === "grace_period" && school.gracePeriodEndsAt && now > school.gracePeriodEndsAt) {
    const settings = await prisma.platformSettings.findUnique({ where: { id: "singleton" } });
    const policy = (settings?.data as any)?.subscriptionLifecyclePolicy ?? { postGraceAction: "restricted" };
    const nextStatus = policy.postGraceAction === "suspended" ? "suspended" : "restricted";
    return prisma.school.update({ where: { id: school.id }, data: { subscriptionStatus: nextStatus } });
  }

  return school;
}

/* ---- SCH-11: fetch current school info (prefills the settings form) ---- */
schoolsRouter.get(
  "/schools/:id",
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const school = await prisma.school.findUnique({ where: { id: req.params.id }, include: { package: true } });
    if (!school) throw notFound("School");
    const transitioned = await applySubscriptionLifecycle(school);
    res.json({ ...school, ...transitioned });
  })
);

/* ---- SCH-02: dashboard summary ---- */
schoolsRouter.get(
  "/schools/:id/dashboard-summary",
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const schoolId = req.params.id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [activeTrips, todayTrips, totalStudents, activeAlerts, buses] = await Promise.all([
      prisma.trip.count({ where: { schoolId, status: "active" } }),
      prisma.trip.findMany({ where: { schoolId, scheduledAt: { gte: startOfDay, lte: endOfDay } } }),
      prisma.student.count({ where: { schoolId, status: "active" } }),
      prisma.alert.findMany({ where: { schoolId, status: "active" }, orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.bus.findMany({ where: { schoolId } }),
    ]);

    const completedToday = todayTrips.filter((t) => t.status === "completed").length;
    const studentsOnTheWay = await prisma.tripEvent.count({
      where: {
        type: "board",
        timestamp: { gte: startOfDay },
        trip: { schoolId, status: "active" },
      },
    });

    res.json({
      activeTripsCount: activeTrips,
      todayTripsTotal: todayTrips.length,
      todayTripsCompleted: completedToday,
      studentsOnTheWay,
      totalStudents,
      totalBuses: buses.length,
      recentAlerts: activeAlerts,
    });
  })
);

/* ---- A-9: parents/guardians of this school's students ---- */
schoolsRouter.get(
  "/schools/:id/parents",
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const links = await prisma.studentParentLink.findMany({
      where: { schoolId: req.params.id },
      include: { parent: true, student: true },
    });
    const byParent = new Map<string, { parent: (typeof links)[number]["parent"]; students: (typeof links)[number]["student"][] }>();
    for (const link of links) {
      const entry = byParent.get(link.parentUserId) ?? { parent: link.parent, students: [] };
      entry.students.push(link.student);
      byParent.set(link.parentUserId, entry);
    }
    res.json(
      [...byParent.values()].map(({ parent, students }) => ({
        id: parent.id,
        name: parent.name,
        phone: parent.phone,
        subscriptionTier: parent.subscriptionTier,
        subscriptionEndsAt: parent.subscriptionEndsAt,
        children: students.map((s) => ({ id: s.id, name: s.name, grade: s.grade })),
      }))
    );
  })
);

/* ---- SCH-03: students list + create ---- */
schoolsRouter.get(
  "/schools/:id/students",
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const { grade, busId, q } = req.query as Record<string, string | undefined>;
    const where: any = { schoolId: req.params.id };
    if (grade) where.grade = grade;
    if (busId) where.busId = busId;
    if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { code: { contains: q, mode: "insensitive" } }];
    const students = await prisma.student.findMany({ where, orderBy: { name: "asc" } });
    res.json(students);
  })
);

schoolsRouter.post(
  "/schools/:id/students",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const { name, grade, busId, stopId, photoUrl } = req.body ?? {};
    if (!name || !grade) throw badRequest("name and grade are required");
    const code = await nextStudentCode(req.params.id);
    const student = await prisma.student.create({
      data: { schoolId: req.params.id, code, name, grade, busId: busId ?? null, stopId: stopId ?? null, photoUrl: photoUrl ?? null },
    });
    res.status(201).json(student);
  })
);

/* ---- BC-2 / a-import: Excel student bulk import ---- */
schoolsRouter.get(
  "/schools/:id/students/import-template",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const sheet = XLSX.utils.aoa_to_sheet([
      IMPORT_COLUMNS,
      ["أحمد محمد عبدالله", "01234567", "الصف 5", "أ", "1", "خور مكسر المركز", "محمد عبدالله", "+967771234567", ""],
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "الطلاب");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=aman-school-import-template.xlsx");
    res.send(buffer);
  })
);

type ImportRow = {
  row: number; name: string; nationalId: string; grade: string; section: string;
  busNumber: string; stopName: string; parentName: string; parentPhone: string; medicalNote: string;
};

async function validateImportRows(schoolId: string, rows: ImportRow[]) {
  const buses = await prisma.bus.findMany({ where: { schoolId }, include: { route: { include: { stops: true } } } });
  const valid: Array<ImportRow & { busId: string; stopId: string | null }> = [];
  const errors: Array<{ row: number; name: string; grade: string; busNumber: string; error: string }> = [];

  for (const r of rows) {
    if (!r.name || !r.grade) {
      errors.push({ row: r.row, name: r.name, grade: r.grade, busNumber: r.busNumber, error: "الاسم والصف مطلوبان" });
      continue;
    }
    const bus = buses.find((b) => b.busNumber === r.busNumber);
    if (!bus) {
      errors.push({ row: r.row, name: r.name, grade: r.grade, busNumber: r.busNumber, error: "الباص غير موجود" });
      continue;
    }
    if (!/^\+?967\d{9}$/.test(r.parentPhone.replace(/[\s-]/g, ""))) {
      errors.push({ row: r.row, name: r.name, grade: r.grade, busNumber: r.busNumber, error: "رقم جوال ولي الأمر غير صحيح" });
      continue;
    }
    const stop = bus.route?.stops.find((s) => s.name === r.stopName) ?? null;
    valid.push({ ...r, busId: bus.id, stopId: stop?.id ?? null });
  }
  return { valid, errors };
}

schoolsRouter.post(
  "/schools/:id/students/import/preview",
  requireRole("school_admin", "owner", "partner"),
  upload.single("file"),
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    if (!req.file) throw badRequest("file is required");

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: "" });

    const rows: ImportRow[] = raw.map((r, i) => ({
      row: i + 2,
      name: String(r["الاسم الكامل"] ?? "").trim(),
      nationalId: String(r["رقم الهوية"] ?? "").trim(),
      grade: String(r["الصف"] ?? "").trim(),
      section: String(r["الشعبة"] ?? "").trim(),
      busNumber: String(r["الباص"] ?? "").trim(),
      stopName: String(r["المحطة"] ?? "").trim(),
      parentName: String(r["اسم ولي الأمر"] ?? "").trim(),
      parentPhone: String(r["جوال ولي الأمر"] ?? "").trim(),
      medicalNote: String(r["ملاحظات طبية"] ?? "").trim(),
    }));

    const { valid, errors } = await validateImportRows(req.params.id, rows);
    res.json({ validCount: valid.length, errorCount: errors.length, validRows: valid, errorRows: errors });
  })
);

schoolsRouter.post(
  "/schools/:id/students/import/confirm",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const { rows } = req.body ?? {};
    if (!Array.isArray(rows) || rows.length === 0) throw badRequest("rows[] is required");

    let imported = 0;
    for (const r of rows as Array<ImportRow & { busId: string; stopId: string | null }>) {
      const code = await nextStudentCode(req.params.id);
      const student = await prisma.student.create({
        data: {
          schoolId: req.params.id, code, name: r.name,
          grade: r.section ? `${r.grade} ${r.section}` : r.grade,
          busId: r.busId, stopId: r.stopId,
        },
      });

      let parent = await prisma.user.findFirst({ where: { phone: r.parentPhone, role: "parent" } });
      if (!parent) {
        parent = await prisma.user.create({ data: { role: "parent", name: r.parentName || "ولي أمر", phone: r.parentPhone } });
      }
      await prisma.studentParentLink.create({ data: { studentId: student.id, parentUserId: parent.id, schoolId: req.params.id } });

      if (r.medicalNote) {
        await prisma.medicalProfile.upsert({
          where: { studentId: student.id },
          update: { chronicConditions: r.medicalNote },
          create: { studentId: student.id, chronicConditions: r.medicalNote, emergencyContactName: r.parentName || "ولي أمر", emergencyContactPhone: r.parentPhone },
        });
      }

      console.log(`[dev-sms] تم تسجيل ${student.name} في أمان سكول — سجّل دخولك برقم: ${r.parentPhone}`);
      imported++;
    }
    res.status(201).json({ ok: true, imported });
  })
);

/* ---- SCH-05: buses list + create ---- */
schoolsRouter.get(
  "/schools/:id/buses",
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const buses = await prisma.bus.findMany({ where: { schoolId: req.params.id }, include: { route: { include: { stops: true } } } });
    res.json(buses);
  })
);

schoolsRouter.post(
  "/schools/:id/buses",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const { busNumber, plateNumber, capacity } = req.body ?? {};
    if (!busNumber || !plateNumber || !capacity) throw badRequest("busNumber, plateNumber and capacity are required");
    const bus = await prisma.bus.create({ data: { schoolId: req.params.id, busNumber, plateNumber, capacity } });
    res.status(201).json(bus);
  })
);

/* ---- SCH-06: supervisors list + create (auto-provisions their login) ---- */
schoolsRouter.get(
  "/schools/:id/supervisors",
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const supervisors = await prisma.user.findMany({
      where: { schoolId: req.params.id, role: "supervisor" },
      include: { supervisedBus: true },
    });
    res.json(supervisors.map((s) => ({ ...toUserDto(s), busId: s.supervisedBus?.id ?? null, busNumber: s.supervisedBus?.busNumber ?? null })));
  })
);

schoolsRouter.post(
  "/schools/:id/supervisors",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const { name, phone, busId } = req.body ?? {};
    if (!name || !phone) throw badRequest("name and phone are required");

    const employeeCode = randomEmployeeCode();
    const pin = randomDigits(4);
    const supervisor = await prisma.user.create({
      data: {
        role: "supervisor",
        name,
        phone,
        schoolId: req.params.id,
        employeeCode,
        pinHash: hashSecret(pin),
        supervisedBus: busId ? { connect: { id: busId } } : undefined,
      },
    });

    // No real SMS provider in this environment — see auth.routes.ts OTP note
    // for the same dev-only pattern. Production sends this via SMS gateway.
    console.log(`[dev-sms] Supervisor app credentials for ${name} (${phone}): employeeCode=${employeeCode} pin=${pin}`);

    res.status(201).json({ ...toUserDto(supervisor), devEmployeeCode: employeeCode, devPin: pin });
  })
);

/* ---- OP-1.2: edit a supervisor / reassign bus / reset PIN / end service ---- */
schoolsRouter.put(
  "/schools/:id/supervisors/:supervisorId",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const supervisor = await prisma.user.findUnique({ where: { id: req.params.supervisorId } });
    if (!supervisor || supervisor.schoolId !== req.params.id || supervisor.role !== "supervisor") throw notFound("Supervisor");

    const { name, phone, busId } = req.body ?? {};
    const updated = await prisma.user.update({
      where: { id: supervisor.id },
      data: { name, phone, supervisedBus: busId ? { connect: { id: busId } } : busId === null ? { disconnect: true } : undefined },
    });
    res.json(toUserDto(updated));
  })
);

schoolsRouter.put(
  "/schools/:id/supervisors/:supervisorId/reset-pin",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const supervisor = await prisma.user.findUnique({ where: { id: req.params.supervisorId } });
    if (!supervisor || supervisor.schoolId !== req.params.id) throw notFound("Supervisor");
    const pin = randomDigits(4);
    await prisma.user.update({ where: { id: supervisor.id }, data: { pinHash: hashSecret(pin) } });
    console.log(`[dev-sms] New PIN for ${supervisor.name}: ${pin}`);
    res.json({ ok: true, devPin: pin });
  })
);

schoolsRouter.put(
  "/schools/:id/supervisors/:supervisorId/end-service",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const supervisor = await prisma.user.findUnique({ where: { id: req.params.supervisorId }, include: { supervisedBus: true } });
    if (!supervisor || supervisor.schoolId !== req.params.id) throw notFound("Supervisor");
    if (supervisor.supervisedBus) {
      const activeTrip = await prisma.trip.findFirst({ where: { busId: supervisor.supervisedBus.id, status: "active" } });
      if (activeTrip) throw badRequest("لا يمكن إنهاء خدمة مشرف لديه رحلة نشطة الآن");
      await prisma.bus.update({ where: { id: supervisor.supervisedBus.id }, data: { supervisorId: null } });
    }
    res.json({ ok: true });
  })
);

/* ---- OP-2: driver roster (auto-provisions their login, DRV- code + PIN) ---- */
schoolsRouter.get(
  "/schools/:id/drivers",
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const drivers = await prisma.user.findMany({ where: { schoolId: req.params.id, role: "driver" }, include: { drivenBus: true } });
    res.json(drivers.map((d) => ({ ...toUserDto(d), busId: d.drivenBus?.id ?? null, busNumber: d.drivenBus?.busNumber ?? null })));
  })
);

schoolsRouter.post(
  "/schools/:id/drivers",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const { name, phone, busId, licenseNumber, licenseExpiresAt, yearsExperience } = req.body ?? {};
    if (!name || !phone || !licenseNumber) throw badRequest("name, phone and licenseNumber are required");

    const employeeCode = randomDriverCode();
    const pin = randomDigits(4);
    const driver = await prisma.user.create({
      data: {
        role: "driver", name, phone, schoolId: req.params.id, employeeCode, pinHash: hashSecret(pin),
        licenseNumber, licenseExpiresAt: licenseExpiresAt ? new Date(licenseExpiresAt) : null,
        yearsExperience: yearsExperience ?? null,
        drivenBus: busId ? { connect: { id: busId } } : undefined,
      },
    });
    console.log(`[dev-sms] Driver app credentials for ${name} (${phone}): employeeCode=${employeeCode} pin=${pin}`);
    res.status(201).json({ ...toUserDto(driver), devEmployeeCode: employeeCode, devPin: pin });
  })
);

schoolsRouter.put(
  "/schools/:id/drivers/:driverId",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const driver = await prisma.user.findUnique({ where: { id: req.params.driverId } });
    if (!driver || driver.schoolId !== req.params.id || driver.role !== "driver") throw notFound("Driver");
    const { name, phone, busId, licenseNumber, licenseExpiresAt, yearsExperience } = req.body ?? {};
    const updated = await prisma.user.update({
      where: { id: driver.id },
      data: {
        name, phone, licenseNumber, yearsExperience,
        licenseExpiresAt: licenseExpiresAt ? new Date(licenseExpiresAt) : undefined,
        drivenBus: busId ? { connect: { id: busId } } : busId === null ? { disconnect: true } : undefined,
      },
    });
    res.json(toUserDto(updated));
  })
);

/* ---- OP-3 / a-calendar: holidays and trip-disabling ---- */
schoolsRouter.get(
  "/schools/:id/holidays",
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const holidays = await prisma.holiday.findMany({ where: { schoolId: req.params.id }, orderBy: { date: "asc" } });
    res.json(holidays);
  })
);

schoolsRouter.post(
  "/schools/:id/holidays",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const { date, reason, scope } = req.body ?? {};
    if (!date || !reason) throw badRequest("date and reason are required");
    const holiday = await prisma.holiday.create({
      data: { schoolId: req.params.id, date: new Date(date), reason, scope: scope ?? "all" },
    });

    const links = await prisma.studentParentLink.findMany({ where: { schoolId: req.params.id }, select: { parentUserId: true } });
    const supervisors = await prisma.user.findMany({ where: { schoolId: req.params.id, role: "supervisor" } });
    const recipientIds = [...new Set([...links.map((l) => l.parentUserId), ...supervisors.map((s) => s.id)])];
    await prisma.notification.createMany({
      data: recipientIds.map((userId) => ({
        userId, title: "لا توجد رحلات", body: `لا توجد رحلات بتاريخ ${new Date(date).toLocaleDateString("ar-YE")} — ${reason}`, type: "holiday",
      })),
    });
    res.status(201).json(holiday);
  })
);

schoolsRouter.delete(
  "/schools/:id/holidays/:holidayId",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    await prisma.holiday.delete({ where: { id: req.params.holidayId } });
    res.status(204).send();
  })
);

/** Whether trips are disabled for this school today/this shift — used by
 * s-home and p-home to show "no trips today" instead of a normal dashboard. */
export async function isTripsDisabledToday(schoolId: string, shift?: "morning" | "evening") {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const holiday = await prisma.holiday.findFirst({
    where: { schoolId, date: { gte: startOfDay, lte: endOfDay }, OR: [{ scope: "all" }, ...(shift ? [{ scope: shift }] : [])] },
  });
  return holiday;
}

schoolsRouter.get(
  "/schools/:id/today-status",
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const holiday = await isTripsDisabledToday(req.params.id);
    res.json({ disabled: !!holiday, holiday });
  })
);

/* ---- SCH-09: reports (attendance/delay summary over a date range) ---- */
schoolsRouter.get(
  "/schools/:id/reports",
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const from = req.query.from ? new Date(String(req.query.from)) : new Date(Date.now() - 30 * 86400000);
    const to = req.query.to ? new Date(String(req.query.to)) : new Date();

    const trips = await prisma.trip.findMany({
      where: { schoolId: req.params.id, scheduledAt: { gte: from, lte: to } },
    });
    const alerts = await prisma.alert.findMany({
      where: { schoolId: req.params.id, createdAt: { gte: from, lte: to } },
    });

    res.json({
      range: { from, to },
      tripsScheduled: trips.length,
      tripsCompleted: trips.filter((t) => t.status === "completed").length,
      tripsCancelled: trips.filter((t) => t.status === "cancelled").length,
      alertsByType: {
        sos: alerts.filter((a) => a.type === "sos").length,
        delay: alerts.filter((a) => a.type === "delay").length,
        incident: alerts.filter((a) => a.type === "incident").length,
        exception: alerts.filter((a) => a.type === "exception").length,
      },
    });
  })
);

/* ---- SCH-10: broadcast a notification to every parent of the school's students ---- */
schoolsRouter.post(
  "/schools/:id/notifications/broadcast",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const { title, body } = req.body ?? {};
    if (!title || !body) throw badRequest("title and body are required");

    const links = await prisma.studentParentLink.findMany({ where: { schoolId: req.params.id }, select: { parentUserId: true } });
    const parentIds = [...new Set(links.map((l) => l.parentUserId))];
    await prisma.notification.createMany({
      data: parentIds.map((userId) => ({ userId, title, body, type: "broadcast" })),
    });
    res.status(201).json({ ok: true, recipients: parentIds.length });
  })
);

/* ---- SCH-11: school settings ---- */
schoolsRouter.put(
  "/schools/:id/settings",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    assertSchoolAccess(req.user!, req.params.id);
    const { name, address, logoUrl } = req.body ?? {};
    const updated = await prisma.school.update({ where: { id: req.params.id }, data: { name, address, logoUrl } });
    res.json(updated);
  })
);

/* ---- OWN-02: owner toggles a school's subscription status ---- */
schoolsRouter.put(
  "/schools/:id/status",
  requireRole("owner", "partner"),
  asyncHandler(async (req, res) => {
    const { status } = req.body ?? {};
    if (!status) throw badRequest("status is required");
    const school = await prisma.school.findUnique({ where: { id: req.params.id } });
    if (!school) throw notFound("School");
    const updated = await prisma.school.update({ where: { id: req.params.id }, data: { subscriptionStatus: status } });
    res.json(updated);
  })
);
