import { Router } from "express";
import type { JwtClaims } from "@aman-school/types";
import { prisma } from "../prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { authenticate, requireRole } from "../auth/middleware";
import { badRequest, forbidden, notFound } from "../lib/errors";
import { buildStudentCode } from "../lib/codes";
import QRCode from "qrcode";

export const studentsRouter = Router();
studentsRouter.use(authenticate);

async function assertStudentAccess(user: JwtClaims, student: { id: string; schoolId: string }) {
  if (user.role === "owner" || user.role === "partner") return;
  if (user.role === "parent") {
    const link = await prisma.studentParentLink.findFirst({ where: { studentId: student.id, parentUserId: user.sub } });
    if (!link) throw forbidden("This student is not linked to your account");
    return;
  }
  if (user.schoolId !== student.schoolId) throw forbidden();
}

/* ---- S-07: search roster (supervisor manual entry) ---- */
studentsRouter.get(
  "/students/search",
  requireRole("supervisor", "school_admin", "ops_room", "owner", "partner"),
  asyncHandler(async (req, res) => {
    const q = String(req.query.q ?? "").trim();
    if (!q) return res.json([]);
    const where: any = {
      OR: [{ name: { contains: q, mode: "insensitive" } }, { code: { contains: q, mode: "insensitive" } }],
    };
    if (req.user!.role !== "owner" && req.user!.role !== "partner") {
      where.schoolId = req.user!.schoolId;
    }
    const students = await prisma.student.findMany({ where, take: 20 });
    res.json(students);
  })
);

studentsRouter.get(
  "/students/:id/today-status",
  asyncHandler(async (req, res) => {
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) throw notFound("Student");
    await assertStudentAccess(req.user!, student);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const lastEvent = await prisma.tripEvent.findFirst({
      where: { studentId: student.id, timestamp: { gte: startOfDay } },
      orderBy: { timestamp: "desc" },
      include: { trip: true },
    });

    let status: "home" | "on_the_way" | "at_school" = "home";
    if (lastEvent) {
      if (lastEvent.type === "board") status = "on_the_way";
      else status = lastEvent.trip.direction === "to_school" ? "at_school" : "home";
    }
    res.json({ studentId: student.id, status, lastEvent: lastEvent ?? null });
  })
);

studentsRouter.get(
  "/students/:id/details",
  asyncHandler(async (req, res) => {
    const student = await prisma.student.findUnique({
      where: { id: req.params.id },
      include: { bus: { include: { supervisor: true } }, stop: true, school: true },
    });
    if (!student) throw notFound("Student");
    await assertStudentAccess(req.user!, student);
    res.json(student);
  })
);

studentsRouter.get(
  "/students/:id",
  asyncHandler(async (req, res) => {
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) throw notFound("Student");
    await assertStudentAccess(req.user!, student);
    res.json(student);
  })
);

studentsRouter.put(
  "/students/:id",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) throw notFound("Student");
    await assertStudentAccess(req.user!, student);
    const { name, grade, photoUrl, busId, stopId, status } = req.body ?? {};
    const updated = await prisma.student.update({
      where: { id: student.id },
      data: { name, grade, photoUrl, busId, stopId, status },
    });
    res.json(updated);
  })
);

studentsRouter.put(
  "/students/:id/stop",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) throw notFound("Student");
    await assertStudentAccess(req.user!, student);
    const { stopId } = req.body ?? {};
    if (!stopId) throw badRequest("stopId is required");
    const updated = await prisma.student.update({ where: { id: student.id }, data: { stopId } });
    res.json(updated);
  })
);

studentsRouter.get(
  "/students/:id/qr-code",
  asyncHandler(async (req, res) => {
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) throw notFound("Student");
    await assertStudentAccess(req.user!, student);
    const qrDataUrl = await QRCode.toDataURL(student.code);
    res.json({ qrDataUrl });
  })
);

studentsRouter.get(
  "/students/:id/trips",
  asyncHandler(async (req, res) => {
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) throw notFound("Student");
    await assertStudentAccess(req.user!, student);

    const from = req.query.from ? new Date(String(req.query.from)) : new Date(0);
    const to = req.query.to ? new Date(String(req.query.to)) : new Date();
    if (!student.busId) return res.json([]);

    const trips = await prisma.trip.findMany({
      where: { busId: student.busId, schoolId: student.schoolId, scheduledAt: { gte: from, lte: to } },
      orderBy: { scheduledAt: "desc" },
      include: { ratings: { where: { parentUserId: req.user!.sub } } },
    });
    res.json(trips);
  })
);

/* ---- SF-2: medical profile — parent manages it, school/ops always read,
 * supervisor only via the audited emergency-access endpoint below ---- */
studentsRouter.get(
  "/students/:id/medical",
  asyncHandler(async (req, res) => {
    if (req.user!.role === "supervisor") throw forbidden("Use /students/:id/medical/emergency-access");
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) throw notFound("Student");
    await assertStudentAccess(req.user!, student);
    const profile = await prisma.medicalProfile.findUnique({ where: { studentId: student.id } });
    res.json(profile);
  })
);

studentsRouter.put(
  "/students/:id/medical",
  requireRole("parent", "school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) throw notFound("Student");
    await assertStudentAccess(req.user!, student);
    const {
      bloodType, allergies, medications, chronicConditions,
      emergencyContactName, emergencyContactPhone, doctorName,
    } = req.body ?? {};
    if (!emergencyContactName || !emergencyContactPhone) {
      throw badRequest("emergencyContactName and emergencyContactPhone are required");
    }
    const profile = await prisma.medicalProfile.upsert({
      where: { studentId: student.id },
      update: { bloodType, allergies: allergies ?? [], medications: medications ?? [], chronicConditions, emergencyContactName, emergencyContactPhone, doctorName },
      create: {
        studentId: student.id, bloodType, allergies: allergies ?? [], medications: medications ?? [],
        chronicConditions, emergencyContactName, emergencyContactPhone, doctorName,
      },
    });
    res.json(profile);
  })
);

/* ---- SF-7: emergency-only medical access for the supervisor, fully audited ---- */
studentsRouter.post(
  "/students/:id/medical/emergency-access",
  requireRole("supervisor"),
  asyncHandler(async (req, res) => {
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) throw notFound("Student");
    if (req.user!.schoolId !== student.schoolId) throw forbidden();
    const { tripId } = req.body ?? {};

    const profile = await prisma.medicalProfile.findUnique({ where: { studentId: student.id } });
    await prisma.medicalAccessLog.create({
      data: { studentId: student.id, supervisorId: req.user!.sub, tripId: tripId ?? null },
    });
    res.json(profile);
  })
);

studentsRouter.get(
  "/students/:id/medical/access-logs",
  requireRole("school_admin", "owner", "partner"),
  asyncHandler(async (req, res) => {
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) throw notFound("Student");
    await assertStudentAccess(req.user!, student);
    const logs = await prisma.medicalAccessLog.findMany({
      where: { studentId: student.id },
      include: { supervisor: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(logs);
  })
);

/* ---- SF-3: pickup delegation ---- */
studentsRouter.get(
  "/students/:id/delegates",
  asyncHandler(async (req, res) => {
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) throw notFound("Student");
    await assertStudentAccess(req.user!, student);
    const delegates = await prisma.delegate.findMany({ where: { studentId: student.id }, orderBy: { createdAt: "desc" } });
    res.json(delegates);
  })
);

studentsRouter.post(
  "/students/:id/delegates",
  requireRole("parent"),
  asyncHandler(async (req, res) => {
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) throw notFound("Student");
    await assertStudentAccess(req.user!, student);
    const { type, fromDate, toDate, name, nationalId, relation, phone, photoUrl } = req.body ?? {};
    if (!type || !name || !nationalId || !relation || !phone) {
      throw badRequest("type, name, nationalId, relation and phone are required");
    }
    const delegate = await prisma.delegate.create({
      data: {
        studentId: student.id, type, name, nationalId, relation, phone, photoUrl: photoUrl ?? null,
        fromDate: fromDate ? new Date(fromDate) : null, toDate: toDate ? new Date(toDate) : null,
      },
    });
    res.status(201).json(delegate);
  })
);

studentsRouter.put(
  "/students/:id/delegates/:delegateId/cancel",
  requireRole("parent"),
  asyncHandler(async (req, res) => {
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) throw notFound("Student");
    await assertStudentAccess(req.user!, student);
    const updated = await prisma.delegate.update({
      where: { id: req.params.delegateId },
      data: { status: "cancelled" },
    });
    res.json(updated);
  })
);

/** Whichever delegate is authorized right now for this student, if any —
 * used by s-verify-pickup to decide whether to show the identity-check flow. */
export async function activeDelegateFor(studentId: string) {
  const now = new Date();
  return prisma.delegate.findFirst({
    where: {
      studentId,
      status: "active",
      OR: [
        { type: "permanent" },
        { type: "single_day", fromDate: { lte: now }, toDate: null },
        { type: "period", fromDate: { lte: now }, toDate: { gte: now } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
}

/* ---- SF-4: report a lost NFC bracelet — revokes it immediately ---- */
studentsRouter.post(
  "/students/:id/nfc/report-lost",
  requireRole("parent"),
  asyncHandler(async (req, res) => {
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) throw notFound("Student");
    await assertStudentAccess(req.user!, student);
    const { reason } = req.body ?? {};
    const updated = await prisma.student.update({
      where: { id: student.id },
      data: { nfcRevoked: true, nfcRevokedAt: new Date(), nfcRevokedReason: reason ?? null },
    });
    res.json(updated);
  })
);

/* ---- OP-4: pre-announced absence ---- */
studentsRouter.get(
  "/students/:id/absences",
  asyncHandler(async (req, res) => {
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) throw notFound("Student");
    await assertStudentAccess(req.user!, student);
    const absences = await prisma.absence.findMany({ where: { studentId: student.id }, orderBy: { createdAt: "desc" } });
    res.json(absences);
  })
);

studentsRouter.post(
  "/students/:id/absences",
  requireRole("parent"),
  asyncHandler(async (req, res) => {
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) throw notFound("Student");
    await assertStudentAccess(req.user!, student);
    const { fromDate, toDate, reason } = req.body ?? {};
    if (!fromDate || !toDate) throw badRequest("fromDate and toDate are required");

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const requestedFrom = new Date(fromDate);
    if (requestedFrom < startOfToday) {
      const morningTripToday = await prisma.trip.findFirst({
        where: { busId: student.busId ?? undefined, scheduledAt: { gte: startOfToday }, status: { in: ["active", "completed"] } },
      });
      if (morningTripToday) throw badRequest("لا يمكن الإبلاغ بعد بدء رحلة اليوم");
    }

    const absence = await prisma.absence.create({
      data: { studentId: student.id, fromDate: new Date(fromDate), toDate: new Date(toDate), reason: reason ?? null },
    });
    res.status(201).json(absence);
  })
);

studentsRouter.put(
  "/students/:id/absences/:absenceId/cancel",
  requireRole("parent"),
  asyncHandler(async (req, res) => {
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) throw notFound("Student");
    await assertStudentAccess(req.user!, student);
    const updated = await prisma.absence.update({ where: { id: req.params.absenceId }, data: { status: "cancelled" } });
    res.json(updated);
  })
);

/** Whether this student has an active, currently-in-effect absence report —
 * used by s-students to show "reported absent" instead of an unexplained gap. */
export async function activeAbsenceFor(studentId: string) {
  const now = new Date();
  return prisma.absence.findFirst({
    where: { studentId, status: "active", fromDate: { lte: now }, toDate: { gte: now } },
  });
}

// Exposed for the school module's student-creation flow (SCH-03), which needs
// a deterministic next serial for the code format `{slug}-{year}-{serial}`.
export async function nextStudentCode(schoolId: string): Promise<string> {
  const school = await prisma.school.findUniqueOrThrow({ where: { id: schoolId } });
  const year = new Date().getFullYear();
  const count = await prisma.student.count({ where: { schoolId } });
  return buildStudentCode(school.slug, year, count + 1);
}
