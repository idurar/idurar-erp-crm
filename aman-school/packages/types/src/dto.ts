import { z } from "zod";
import { RoleSchema } from "./roles";
import { UserSchema, TripEventTypeSchema } from "./entities";

/* ---- Auth (screens S-01, P-02/P-03, SCH-01) ---- */

export const SupervisorLoginRequestSchema = z.object({
  employeeCode: z.string(),
});
export const SupervisorPinVerifyRequestSchema = z.object({
  employeeCode: z.string(),
  pin: z.string().min(4).max(6),
});

export const ParentRequestOtpRequestSchema = z.object({
  phone: z.string(),
});
export const ParentVerifyOtpRequestSchema = z.object({
  phone: z.string(),
  code: z.string().length(6),
});

export const SchoolAdminLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  otp: z.string().optional(),
});

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: UserSchema,
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

/* ---- Boarding (S-05, S-07) ---- */

export const BoardEventRequestSchema = z.object({
  studentId: z.string().uuid(),
  method: z.enum(["nfc", "manual"]).default("nfc"),
  manualReason: z.string().optional(),
});
export const AlightEventRequestSchema = z.object({
  studentId: z.string().uuid(),
});
export const ManualBoardRequestSchema = z.object({
  studentId: z.string().uuid(),
  reason: z.string(),
});

/* ---- Emergency (S-12) ---- */

export const SosRequestSchema = z.object({
  tripId: z.string().uuid().nullable(),
  lat: z.number(),
  lng: z.number(),
  description: z.string().optional(),
});

/* ---- Parent linking (P-04, P-12) ---- */

export const LinkStudentRequestSchema = z.object({
  studentCode: z.string(), // SCHOOL-2026-XXXXX
});

/* ---- Alerts (OPS-02) ---- */

export const AcknowledgeAlertRequestSchema = z.object({
  assignedToUserId: z.string().uuid().optional(),
});
export const ResolveAlertRequestSchema = z.object({
  reason: z.string(),
});

/* ---- Owner: school registration (OWN-02) ---- */

export const RegisterSchoolRequestSchema = z.object({
  name: z.string(),
  slug: z.string(),
  address: z.string().optional(),
  adminName: z.string(),
  adminEmail: z.string().email(),
  packageId: z.string().uuid(),
  partnerId: z.string().uuid().optional(),
});

/* ---- Subscriptions & payments (shared subscribe+payment flow) ---- */

export const CreatePaymentRequestSchema = z.object({
  subjectType: z.enum(["parent", "school"]),
  subjectId: z.string().uuid(), // parentUserId or schoolId
  packageName: z.string(),
  cycle: z.enum(["monthly", "quarterly", "yearly"]),
  amount: z.number(),
  method: z.enum(["ecash", "bank_transfer", "cash", "yemenpay"]),
  receiptUrl: z.string().optional(),
});
export type CreatePaymentRequest = z.infer<typeof CreatePaymentRequestSchema>;

/* ---- System Administrator (sa-*) ---- */

export const SysadminLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  otp: z.string().optional(),
});

export type BoardEventRequest = z.infer<typeof BoardEventRequestSchema>;
export type SosRequest = z.infer<typeof SosRequestSchema>;
export type LinkStudentRequest = z.infer<typeof LinkStudentRequestSchema>;
export type RegisterSchoolRequest = z.infer<typeof RegisterSchoolRequestSchema>;
export { RoleSchema, TripEventTypeSchema };
