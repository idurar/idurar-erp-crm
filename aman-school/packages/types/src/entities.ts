import { z } from "zod";

export const SubscriptionStatusSchema = z.enum([
  "active",
  "suspended",
  "expired",
  "trial",
  "grace_period",
  "restricted",
]);
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;

export const PackageSchema = z.object({
  id: z.string().uuid(),
  name: z.string(), // "أساسي" | "متقدم" | "شامل"
  priceMonthly: z.number(),
  studentLimit: z.number(),
  features: z.array(z.string()),
});
export type Package = z.infer<typeof PackageSchema>;

export const PartnerTierNameSchema = z.enum(["silver", "gold"]);

export const PartnerTierSchema = z.object({
  id: z.string().uuid(),
  name: PartnerTierNameSchema,
  labelAr: z.string(),
  commissionPercent: z.number(),
  minActiveSchools: z.number(),
});
export type PartnerTier = z.infer<typeof PartnerTierSchema>;

export const PartnerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  region: z.string(),
  commissionPercent: z.number(),
  tierId: z.string().uuid().nullable(),
  autoTierUpgrade: z.boolean(),
  createdAt: z.string().datetime(),
});
export type Partner = z.infer<typeof PartnerSchema>;

export const SchoolSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(), // used as student-code prefix, e.g. "SCHOOL"
  name: z.string(),
  address: z.string().nullable(),
  logoUrl: z.string().nullable(),
  licenseNumber: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  packageId: z.string().uuid().nullable(),
  partnerId: z.string().uuid().nullable(),
  subscriptionStatus: SubscriptionStatusSchema,
  subscriptionEndsAt: z.string().datetime().nullable(),
  gracePeriodEndsAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
});
export type School = z.infer<typeof SchoolSchema>;

export const StopSchema = z.object({
  id: z.string().uuid(),
  routeId: z.string().uuid(),
  order: z.number(),
  name: z.string(),
  lat: z.number(),
  lng: z.number(),
  radius: z.number(), // geofence radius in meters
});
export type Stop = z.infer<typeof StopSchema>;

export const RouteSchema = z.object({
  id: z.string().uuid(),
  schoolId: z.string().uuid(),
  busId: z.string().uuid(),
  polyline: z.array(z.object({ lat: z.number(), lng: z.number() })).nullable(),
  deviationSensitivity: z.enum(["low", "medium", "high"]),
  stops: z.array(StopSchema),
});
export type RouteEntity = z.infer<typeof RouteSchema>;

export const BusSchema = z.object({
  id: z.string().uuid(),
  schoolId: z.string().uuid(),
  busNumber: z.string(),
  plateNumber: z.string(),
  capacity: z.number(),
  supervisorId: z.string().uuid().nullable(),
  driverId: z.string().uuid().nullable(),
  gpsDeviceId: z.string().nullable(),
  outOfService: z.boolean(),
  outOfServiceReason: z.string().nullable(),
  lastMaintenanceAt: z.string().datetime().nullable(),
  inspectionExpiresAt: z.string().datetime().nullable(),
  insuranceExpiresAt: z.string().datetime().nullable(),
});
export type Bus = z.infer<typeof BusSchema>;

export const StudentStatusSchema = z.enum(["active", "suspended", "withdrawn", "graduated", "archived"]);

export const StudentSchema = z.object({
  id: z.string().uuid(),
  schoolId: z.string().uuid(),
  code: z.string(), // SCHOOL-2026-XXXXX
  name: z.string(),
  grade: z.string(),
  photoUrl: z.string().nullable(),
  busId: z.string().uuid().nullable(),
  stopId: z.string().uuid().nullable(),
  status: StudentStatusSchema,
  nfcRevoked: z.boolean(),
  nfcRevokedAt: z.string().datetime().nullable(),
  nfcRevokedReason: z.string().nullable(),
});
export type Student = z.infer<typeof StudentSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["owner", "sysadmin", "partner", "school_admin", "ops_room", "supervisor", "parent", "driver", "regulator"]),
  name: z.string(),
  phone: z.string().nullable(),
  email: z.string().email().nullable(),
  schoolId: z.string().uuid().nullable(),
  partnerId: z.string().uuid().nullable(),
  employeeCode: z.string().nullable(), // supervisor/driver login
  licenseNumber: z.string().nullable().optional(),
  licenseExpiresAt: z.string().datetime().nullable().optional(),
  yearsExperience: z.number().nullable().optional(),
});
export type User = z.infer<typeof UserSchema>;

export const TripDirectionSchema = z.enum(["to_school", "to_home"]);
export const TripStatusSchema = z.enum(["scheduled", "active", "completed", "cancelled"]);
export const TripShiftSchema = z.enum(["morning", "evening"]);

export const TripSchema = z.object({
  id: z.string().uuid(),
  schoolId: z.string().uuid(),
  busId: z.string().uuid(),
  supervisorId: z.string().uuid().nullable(),
  direction: TripDirectionSchema,
  shift: TripShiftSchema,
  status: TripStatusSchema,
  scheduledAt: z.string().datetime(),
  startedAt: z.string().datetime().nullable(),
  endedAt: z.string().datetime().nullable(),
});
export type Trip = z.infer<typeof TripSchema>;

export const TripEventTypeSchema = z.enum(["board", "alight"]);
export const TripEventMethodSchema = z.enum(["nfc", "manual"]);

export const TripEventSchema = z.object({
  id: z.string().uuid(),
  tripId: z.string().uuid(),
  studentId: z.string().uuid(),
  type: TripEventTypeSchema,
  method: TripEventMethodSchema,
  manualReason: z.string().nullable(),
  timestamp: z.string().datetime(),
});
export type TripEvent = z.infer<typeof TripEventSchema>;

export const TripRatingSchema = z.object({
  id: z.string().uuid(),
  tripId: z.string().uuid(),
  parentUserId: z.string().uuid(),
  stars: z.number().min(1).max(5),
  note: z.string().nullable(),
  createdAt: z.string().datetime(),
});
export type TripRating = z.infer<typeof TripRatingSchema>;

export const AlertPrioritySchema = z.enum(["urgent_critical", "urgent", "notice"]);
export const AlertStatusSchema = z.enum(["active", "acknowledged", "resolved"]);
export const AlertTypeSchema = z.enum([
  "sos",
  "delay",
  "incident",
  "exception",
  "student_not_collected",
  "route_deviation",
  "maintenance_due",
]);

export const AlertSchema = z.object({
  id: z.string().uuid(),
  schoolId: z.string().uuid(),
  tripId: z.string().uuid().nullable(),
  busId: z.string().uuid().nullable(),
  type: AlertTypeSchema,
  priority: AlertPrioritySchema,
  status: AlertStatusSchema,
  message: z.string().nullable(),
  createdAt: z.string().datetime(),
  acknowledgedAt: z.string().datetime().nullable(),
  resolvedAt: z.string().datetime().nullable(),
});
export type Alert = z.infer<typeof AlertSchema>;

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string(),
  body: z.string(),
  type: z.string(),
  read: z.boolean(),
  createdAt: z.string().datetime(),
});
export type Notification = z.infer<typeof NotificationSchema>;

export const GpsPingSchema = z.object({
  busId: z.string().uuid(),
  lat: z.number(),
  lng: z.number(),
  speedKmh: z.number().nullable(),
  timestamp: z.string().datetime(),
});
export type GpsPing = z.infer<typeof GpsPingSchema>;

/* ---- Subscriptions & payments (Yemen: parent-level + school-level) ---- */

export const PaymentSubjectTypeSchema = z.enum(["parent", "school"]);
export const PaymentMethodSchema = z.enum(["ecash", "bank_transfer", "cash", "yemenpay"]);
export const PaymentStatusSchema = z.enum(["pending", "confirmed", "rejected"]);
export const BillingCycleSchema = z.enum(["monthly", "quarterly", "yearly"]);

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  subjectType: PaymentSubjectTypeSchema,
  parentUserId: z.string().uuid().nullable(),
  schoolId: z.string().uuid().nullable(),
  packageName: z.string(),
  cycle: BillingCycleSchema,
  amount: z.number(),
  method: PaymentMethodSchema,
  status: PaymentStatusSchema,
  receiptUrl: z.string().nullable(),
  createdAt: z.string().datetime(),
  confirmedAt: z.string().datetime().nullable(),
});
export type Payment = z.infer<typeof PaymentSchema>;

export const RefundStatusSchema = z.enum(["pending", "approved", "rejected"]);

export const RefundSchema = z.object({
  id: z.string().uuid(),
  subjectType: PaymentSubjectTypeSchema,
  schoolId: z.string().uuid().nullable(),
  parentUserId: z.string().uuid().nullable(),
  reason: z.string(),
  amountPaid: z.number(),
  amountOwed: z.number(),
  refundAmount: z.number(),
  status: RefundStatusSchema,
  method: z.string().nullable(),
  createdAt: z.string().datetime(),
  resolvedAt: z.string().datetime().nullable(),
});
export type Refund = z.infer<typeof RefundSchema>;

export const InvoiceSchema = z.object({
  id: z.string().uuid(),
  invoiceNumber: z.string(),
  schoolId: z.string().uuid(),
  subjectType: PaymentSubjectTypeSchema,
  parentUserId: z.string().uuid().nullable(),
  amount: z.number(),
  description: z.string().nullable(),
  status: z.enum(["paid", "unpaid"]),
  method: z.string().nullable(),
  pdfUrl: z.string().nullable(),
  issuedAt: z.string().datetime(),
  dueAt: z.string().datetime(),
  paidAt: z.string().datetime().nullable(),
});
export type Invoice = z.infer<typeof InvoiceSchema>;

/** Canonical Yemen pricing (YER) — single source of truth for both parent-level
 * and school-level subscription tiers, per the v3.0 spec. */
export const PARENT_PACKAGE_TIERS = [
  {
    tier: "basic", name: "الأساسية", priceMonthly: 2000, priceYearly: 20000, buses: 1, children: 1,
    features: ["تتبع باص واحد", "إشعارات صعود ونزول", "سجل 30 يوم", "واتساب للدعم"],
  },
  {
    tier: "advanced", name: "المتقدمة", priceMonthly: 3500, priceYearly: 35000, buses: 3, children: 2,
    features: ["تتبع 3 باصات", "إشعارات فورية", "سجل 6 أشهر", "تقارير حضور أسبوعية", "اتصال مباشر بالمشرف"],
  },
  {
    tier: "full", name: "الشاملة", priceMonthly: 6000, priceYearly: 60000, buses: null, children: null,
    features: ["تتبع غير محدود", "جميع الميزات", "سجل سنة كاملة", "دعم أولوية 24/7", "تنبيهات SOS فورية"],
  },
] as const;

export const SCHOOL_PACKAGE_TIERS = [
  { tier: "basic", name: "أساسي", priceMonthly: 15000, buses: 2, students: 50 },
  { tier: "advanced", name: "متقدم", priceMonthly: 45000, buses: 5, students: 200 },
  { tier: "full", name: "شامل", priceMonthly: 80000, buses: null, students: null },
] as const;

/** BC-8 — formal partner commission tiers, replacing implicit per-partner percentages. */
export const PARTNER_TIERS = [
  { name: "silver", labelAr: "الشريك الفضي", commissionPercent: 10, minActiveSchools: 1 },
  { name: "gold", labelAr: "الشريك الذهبي", commissionPercent: 15, minActiveSchools: 3 },
] as const;

export const YEMEN_EMERGENCY_NUMBERS = {
  ambulance: "191",
  police: "194",
  fire: "191",
  civilDefense: "191",
  redCrescent: "194",
} as const;

/* ---- v3.1 Phase 1: student safety ---- */

export const ConsentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  trackingConsent: z.boolean(),
  medicalConsent: z.boolean(),
  policyConsent: z.boolean(),
  consentVersion: z.string(),
  createdAt: z.string().datetime(),
});
export type Consent = z.infer<typeof ConsentSchema>;

/** Current consent policy version — bumping this re-shows the consent screen
 * to every previously-consented user on next login (see consent.routes.ts). */
export const CURRENT_CONSENT_VERSION = "2026-07-v1";

export const MedicalProfileSchema = z.object({
  id: z.string().uuid(),
  studentId: z.string().uuid(),
  bloodType: z.string().nullable(),
  allergies: z.array(z.string()),
  medications: z.array(z.string()),
  chronicConditions: z.string().nullable(),
  emergencyContactName: z.string(),
  emergencyContactPhone: z.string(),
  doctorName: z.string().nullable(),
  updatedAt: z.string().datetime(),
});
export type MedicalProfile = z.infer<typeof MedicalProfileSchema>;

export const DelegateTypeSchema = z.enum(["single_day", "period", "permanent"]);
export const DelegateStatusSchema = z.enum(["active", "expired", "cancelled"]);

export const DelegateSchema = z.object({
  id: z.string().uuid(),
  studentId: z.string().uuid(),
  type: DelegateTypeSchema,
  fromDate: z.string().datetime().nullable(),
  toDate: z.string().datetime().nullable(),
  name: z.string(),
  nationalId: z.string(),
  relation: z.string(),
  phone: z.string(),
  photoUrl: z.string().nullable(),
  status: DelegateStatusSchema,
  createdAt: z.string().datetime(),
});
export type Delegate = z.infer<typeof DelegateSchema>;

export const MedicalAccessLogSchema = z.object({
  id: z.string().uuid(),
  studentId: z.string().uuid(),
  supervisorId: z.string().uuid(),
  tripId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
});
export type MedicalAccessLog = z.infer<typeof MedicalAccessLogSchema>;

/* ---- v3.1 Phase 3: operations ---- */

export const HolidaySchema = z.object({
  id: z.string().uuid(),
  schoolId: z.string().uuid(),
  date: z.string().datetime(),
  reason: z.string(),
  scope: z.enum(["all", "morning", "evening"]),
  createdAt: z.string().datetime(),
});
export type Holiday = z.infer<typeof HolidaySchema>;

export const AbsenceSchema = z.object({
  id: z.string().uuid(),
  studentId: z.string().uuid(),
  fromDate: z.string().datetime(),
  toDate: z.string().datetime(),
  reason: z.string().nullable(),
  status: z.enum(["active", "cancelled"]),
  createdAt: z.string().datetime(),
});
export type Absence = z.infer<typeof AbsenceSchema>;

export const MaintenanceTypeSchema = z.enum(["routine", "emergency"]);

export const MaintenanceRecordSchema = z.object({
  id: z.string().uuid(),
  busId: z.string().uuid(),
  type: MaintenanceTypeSchema,
  cost: z.number().nullable(),
  workshop: z.string().nullable(),
  notes: z.string().nullable(),
  date: z.string().datetime(),
  createdAt: z.string().datetime(),
});
export type MaintenanceRecord = z.infer<typeof MaintenanceRecordSchema>;
