import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const hash = (s: string) => bcrypt.hashSync(s, 10);

// عدن — مقر الشركة (ZASTECH One) ومركز المدارس التجريبية، وليس صنعاء.
const ADEN = { lat: 12.7797, lng: 45.0369 };

export async function main() {
  console.log("Seeding Aman School demo data (v3.0 — Aden, Yemen)...");

  // ---- Packages (school-level tiers, YER — matches v3.0 pricing exactly) ----
  const [basic, advanced, full] = await Promise.all([
    prisma.package.create({ data: { name: "أساسي", priceMonthly: 15000, studentLimit: 50, features: ["حتى باصين", "GPS حي", "SMS إشعارات", "دعم بريدي"] } }),
    prisma.package.create({ data: { name: "متقدم", priceMonthly: 35000, studentLimit: 300, features: ["حتى 5 باصات", "NFC سوار", "SOS طوارئ", "جميع الشاشات", "دعم واتساب"] } }),
    // Enterprise/شامل is custom-priced ("حسب الطلب") — priceMonthly=0 is the
    // sentinel the UI (formatPackagePrice) renders as "حسب الطلب" instead of "0 ر.ي".
    prisma.package.create({ data: { name: "شامل", priceMonthly: 0, studentLimit: 100000, features: ["باصات وطلاب غير محدود", "API كامل", "SLA 99.9%", "مدير نجاح", "تكامل ERP"] } }),
  ]);

  // ---- Partner tiers (BC-6, v3.1) ----
  const [silverTier, goldTier] = await Promise.all([
    prisma.partnerTier.create({ data: { name: "silver", labelAr: "فضي", commissionPercent: 15, minActiveSchools: 0 } }),
    prisma.partnerTier.create({ data: { name: "gold", labelAr: "ذهبي", commissionPercent: 20, minActiveSchools: 5 } }),
  ]);

  // ---- Partner ----
  const partner = await prisma.partner.create({
    data: { name: "مكتب ابتكار للتقنية", region: "عدن، اليمن", commissionPercent: 15, tierId: silverTier.id },
  });

  // ---- Schools (both in عدن، كما في الوثيقة v3.0) ----
  const noor = await prisma.school.create({
    data: {
      name: "مدرسة النور الدولية", slug: "noor", address: "خور مكسر — عدن — اليمن",
      packageId: advanced.id, partnerId: partner.id, subscriptionStatus: "active",
    },
  });
  const amal = await prisma.school.create({
    data: {
      name: "مدرسة الأمل", slug: "amal", address: "الشيخ عثمان — عدن — اليمن",
      packageId: basic.id, subscriptionStatus: "trial",
    },
  });

  // ---- Platform-level users ----
  const owner = await prisma.user.create({
    data: { role: "owner", name: "عبدالرحمن باسم", email: "owner@amanschool.ye", passwordHash: hash("Owner@12345") },
  });
  const sysadmin = await prisma.user.create({
    data: { role: "sysadmin", name: "خالد يحيى المقطري", email: "sysadmin@amanschool.ye", passwordHash: hash("Sysadmin@12345") },
  });
  const partnerUser = await prisma.user.create({
    data: { role: "partner", name: "فارس ناصر الجابري", email: "partner@amanschool.ye", passwordHash: hash("Partner@12345"), partnerId: partner.id },
  });
  const regulatorUser = await prisma.user.create({
    data: { role: "regulator", name: "هيئة النقل المدرسي — عدن", email: "regulator@amanschool.ye", passwordHash: hash("Regulator@12345") },
  });

  // ---- School-scoped staff (noor) ----
  const noorAdmin = await prisma.user.create({
    data: { role: "school_admin", name: "محمد حسن الجابري", email: "admin@noor.amanschool.ye", passwordHash: hash("Admin@12345"), schoolId: noor.id },
  });
  const noorOps = await prisma.user.create({
    data: { role: "ops_room", name: "حمادة علي العواضي", email: "ops@noor.amanschool.ye", passwordHash: hash("Ops@12345"), schoolId: noor.id },
  });
  const amalAdmin = await prisma.user.create({
    data: { role: "school_admin", name: "أحمد علي الراشدي", email: "admin@amal.amanschool.ye", passwordHash: hash("Admin@12345"), schoolId: amal.id },
  });

  // ---- Buses + routes (noor — مسارات عدن الحقيقية من الوثيقة) ----
  const bus1 = await prisma.bus.create({ data: { schoolId: noor.id, busNumber: "1", plateNumber: "أ ن ج 1234", capacity: 42 } });
  const bus2 = await prisma.bus.create({ data: { schoolId: noor.id, busNumber: "2", plateNumber: "ب ع م 5678", capacity: 38 } });

  // مسار خور مكسر (40 دقيقة): دار سعد → حي الروضة → خور مكسر المركز → المدينة → مدرسة النور
  const route1 = await prisma.route.create({ data: { schoolId: noor.id, busId: bus1.id } });
  const route1Stops = await Promise.all(
    [
      { order: 0, name: "مدرسة النور (البداية)", lat: ADEN.lat, lng: ADEN.lng },
      { order: 1, name: "دار سعد", lat: 12.911, lng: 44.99 },
      { order: 2, name: "حي الروضة", lat: 12.825, lng: 45.025 },
      { order: 3, name: "خور مكسر المركز", lat: 12.8365, lng: 45.0329 },
      { order: 4, name: "المدينة (النهاية)", lat: 12.84, lng: 45.02 },
    ].map((s) => prisma.stop.create({ data: { routeId: route1.id, ...s } }))
  );

  // مسار المنصورة (35 دقيقة): الشيخ عثمان → المنصورة → حي الوحدة → المعلا
  const route2 = await prisma.route.create({ data: { schoolId: noor.id, busId: bus2.id } });
  const route2Stops = await Promise.all(
    [
      { order: 0, name: "مدرسة النور (البداية)", lat: ADEN.lat, lng: ADEN.lng },
      { order: 1, name: "الشيخ عثمان", lat: 12.87, lng: 44.96 },
      { order: 2, name: "المنصورة", lat: 12.81, lng: 44.995 },
      { order: 3, name: "حي الوحدة", lat: 12.805, lng: 44.99 },
      { order: 4, name: "المعلا (النهاية)", lat: 12.795, lng: 45.02 },
    ].map((s) => prisma.stop.create({ data: { routeId: route2.id, ...s } }))
  );

  // ---- Supervisors (noor) — أسماء وأرقام مطابقة للوثيقة v3.0 ----
  const sup1Pin = "1234";
  const sup2Pin = "1234";
  const sup1 = await prisma.user.create({
    data: {
      role: "supervisor", name: "أحمد سالم المرسي", phone: "+967771000001", schoolId: noor.id,
      employeeCode: "EMP-001", pinHash: hash(sup1Pin), supervisedBus: { connect: { id: bus1.id } },
    },
  });
  const sup2 = await prisma.user.create({
    data: {
      role: "supervisor", name: "محمد عبدالله القحطاني", phone: "+967771000002", schoolId: noor.id,
      employeeCode: "EMP-002", pinHash: hash(sup2Pin), supervisedBus: { connect: { id: bus2.id } },
    },
  });

  // ---- Driver (v3.1, 8th role — distinct from supervisor) ----
  const driverPin = "1234";
  const driver1 = await prisma.user.create({
    data: {
      role: "driver", name: "ياسر محمد الشرعبي", phone: "+967771000003", schoolId: noor.id,
      employeeCode: "DRV-001", pinHash: hash(driverPin), licenseNumber: "YE-DL-88123",
      licenseExpiresAt: new Date("2027-06-30"), yearsExperience: 8,
      drivenBus: { connect: { id: bus1.id } },
    },
  });

  // ---- Holiday example (OP-3, v3.1) ----
  await prisma.holiday.create({
    data: { schoolId: noor.id, date: new Date("2026-08-20"), reason: "إجازة عيد الأضحى", scope: "all" },
  });

  // ---- Students (noor: 10, split across the 2 buses) ----
  const noorStudents = await Promise.all(
    [
      { i: 1, name: "أحمد محمد عبدالله", grade: "الصف 5أ", busId: bus1.id, stopId: route1Stops[2].id },
      { i: 2, name: "سارة أحمد محمد", grade: "الصف 3ب", busId: bus1.id, stopId: route1Stops[2].id },
      { i: 3, name: "علي حسن الوهيبي", grade: "الصف 6أ", busId: bus1.id, stopId: route1Stops[3].id },
      { i: 4, name: "نورة سعد الراشدي", grade: "الصف 4ب", busId: bus1.id, stopId: route1Stops[3].id },
      { i: 5, name: "منى أحمد عبدالله", grade: "الصف 2ج", busId: bus1.id, stopId: route1Stops[1].id },
      { i: 6, name: "خالد عمر الجابري", grade: "الصف 1أ", busId: bus2.id, stopId: route2Stops[1].id },
      { i: 7, name: "فهد ناصر الحضرمي", grade: "الصف 2أ", busId: bus2.id, stopId: route2Stops[2].id },
      { i: 8, name: "عمر خالد الصبري", grade: "الصف 3أ", busId: bus2.id, stopId: route2Stops[2].id },
      { i: 9, name: "يوسف فهد المخلافي", grade: "الصف 4أ", busId: bus2.id, stopId: route2Stops[3].id },
      { i: 10, name: "وليد خالد العبسي", grade: "الصف 5ب", busId: bus2.id, stopId: route2Stops[3].id },
    ].map((s) =>
      prisma.student.create({
        data: { schoolId: noor.id, code: `NOOR-2026-${String(s.i).padStart(3, "0")}`, name: s.name, grade: s.grade, busId: s.busId, stopId: s.stopId },
      })
    )
  );

  // ---- Medical profile example (SF-2, v3.1) ----
  await prisma.medicalProfile.create({
    data: {
      studentId: noorStudents[0].id, bloodType: "O+", allergies: ["فول سوداني"], medications: [],
      chronicConditions: "ربو خفيف", emergencyContactName: "محمد عبدالله أحمد", emergencyContactPhone: "+967772000001",
      doctorName: "د. سامي الحداد",
    },
  });

  const amalStudent = await prisma.student.create({
    data: { schoolId: amal.id, code: "AMAL-2026-001", name: "لمى عبدالله الشرعبي", grade: "الصف 1أ" },
  });

  // ---- Parents (6), one deliberately cross-tenant (links a noor + an amal student) ----
  // Phone format per v3.0 spec: +967 77X (Sabafon) / 71X (Yemen Mobile) / 73X (MTN) / 70X (Y).
  const parentDefs = [
    { name: "محمد عبدالله أحمد", phone: "+967772000001", studentIds: [noorStudents[0].id, noorStudents[4].id] }, // أحمد + منى (إخوة، كما في الوثيقة)
    { name: "أبو سارة", phone: "+967712000002", studentIds: [noorStudents[1].id] },
    { name: "أم علي", phone: "+967732000003", studentIds: [noorStudents[2].id] },
    { name: "أبو نورة", phone: "+967702000004", studentIds: [noorStudents[3].id, amalStudent.id] }, // cross-tenant parent
    { name: "أم يوسف", phone: "+967772000005", studentIds: [noorStudents[8].id] },
    { name: "أبو فهد", phone: "+967712000006", studentIds: [noorStudents[6].id, noorStudents[7].id] },
  ];
  for (const p of parentDefs) {
    const parent = await prisma.user.create({ data: { role: "parent", name: p.name, phone: p.phone, subscriptionTier: "المتقدمة", subscriptionEndsAt: new Date("2026-12-31") } });
    for (const studentId of p.studentIds) {
      const student = await prisma.student.findUniqueOrThrow({ where: { id: studentId } });
      await prisma.studentParentLink.create({ data: { studentId, parentUserId: parent.id, schoolId: student.schoolId } });
    }
  }
  // noorStudents[5] and [9] intentionally left unlinked to show the "not yet linked" state.

  // ---- Trips ----
  const today = new Date();
  today.setHours(6, 30, 0, 0);
  await prisma.trip.create({
    data: { schoolId: noor.id, busId: bus1.id, supervisorId: sup1.id, direction: "to_school", status: "scheduled", scheduledAt: today },
  });

  const startedAt = new Date();
  startedAt.setHours(6, 30, 0, 0);
  const endedAt = new Date();
  endedAt.setHours(7, 15, 0, 0);
  const completedTrip = await prisma.trip.create({
    data: {
      schoolId: noor.id, busId: bus2.id, supervisorId: sup2.id, direction: "to_school",
      status: "completed", scheduledAt: startedAt, startedAt, endedAt,
    },
  });
  for (const student of [noorStudents[5], noorStudents[6]]) {
    await prisma.tripEvent.create({ data: { tripId: completedTrip.id, studentId: student.id, type: "board", method: "nfc", timestamp: startedAt } });
    await prisma.tripEvent.create({ data: { tripId: completedTrip.id, studentId: student.id, type: "alight", method: "nfc", timestamp: endedAt } });
  }

  // ---- Sample resolved alert ----
  await prisma.alert.create({
    data: {
      schoolId: noor.id, busId: bus1.id, type: "delay", priority: "notice", status: "resolved",
      message: "تأخر الباص 15 دقيقة عند منطقة المنصورة", resolvedAt: new Date(), resolutionReason: "تم إبلاغ أولياء الأمور",
    },
  });

  // ---- Sample subscription payment (parent) ----
  await prisma.payment.create({
    data: {
      subjectType: "parent", parentUserId: (await prisma.user.findFirstOrThrow({ where: { phone: "+967772000001" } })).id,
      packageName: "المتقدمة", cycle: "monthly", amount: 3500, method: "ecash", status: "confirmed", confirmedAt: new Date(),
    },
  });

  // ---- Print + write credentials ----
  const lines = [
    "# Aman School — Seeded Demo Credentials (v3.1 — عدن، اليمن)",
    "",
    "Generated by `prisma/seed.ts`. Use these to log into each of the 9 roles.",
    "",
    "## Owner (مالك النظام)",
    `- email: \`owner@amanschool.ye\` / password: \`Owner@12345\` — عبدالرحمن باسم، ZASTECH One`,
    "",
    "## System Administrator (مدير النظام)",
    `- email: \`sysadmin@amanschool.ye\` / password: \`Sysadmin@12345\``,
    "",
    "## Partner (الشريك — مكتب ابتكار للتقنية)",
    `- email: \`partner@amanschool.ye\` / password: \`Partner@12345\` (partnerId: ${partner.id})`,
    "",
    "## Regulator (الجهات التنظيمية — web-only, read-only)",
    `- email: \`regulator@amanschool.ye\` / password: \`Regulator@12345\``,
    "",
    "## School Admin",
    `- مدرسة النور الدولية (خور مكسر): \`admin@noor.amanschool.ye\` / \`Admin@12345\``,
    `- مدرسة الأمل (الشيخ عثمان): \`admin@amal.amanschool.ye\` / \`Admin@12345\``,
    "",
    "## Operations Room",
    `- مدرسة النور: \`ops@noor.amanschool.ye\` / \`Ops@12345\``,
    "",
    "## Supervisors (employeeCode + PIN)",
    `- ${sup1.name}: employeeCode \`EMP-001\`, PIN \`${sup1Pin}\` (باص 1 — مسار خور مكسر)`,
    `- ${sup2.name}: employeeCode \`EMP-002\`, PIN \`${sup2Pin}\` (باص 2 — مسار المنصورة)`,
    "",
    "## Driver (employeeCode + PIN) — 8th role, v3.1",
    `- ${driver1.name}: employeeCode \`DRV-001\`, PIN \`${driverPin}\` (باص 1 — مسار خور مكسر)`,
    "",
    "## Parents (phone + OTP)",
    "Request an OTP with `POST /auth/parent/request-otp {phone}` — the dev server returns/logs `devOtp` since there's no real SMS gateway wired up.",
    ...parentDefs.map((p) => `- ${p.name}: \`${p.phone}\``),
    "",
    "## Student link codes (for Parent App \"Add Student\" flow)",
    ...noorStudents.map((s) => `- ${s.name}: \`${s.code}\``),
    `- لمى عبدالله الشرعبي (مدرسة الأمل — cross-tenant demo student): \`AMAL-2026-001\``,
    "",
    "## أرقام الطوارئ اليمنية (للمرجع)",
    "الإسعاف: 191 | الشرطة: 194 | الإطفاء: 191 | الدفاع المدني: 191 | الهلال الأحمر: 194",
    "",
  ];
  writeFileSync(join(__dirname, "..", "SEED_CREDENTIALS.md"), lines.join("\n"), "utf8");
  console.log(lines.join("\n"));
  console.log("\nSeed complete. Credentials written to backend/SEED_CREDENTIALS.md");
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
