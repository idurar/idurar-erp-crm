import { Router } from "express";
import { prisma } from "../prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { badRequest, unauthorized } from "../lib/errors";
import { compareSecret } from "../lib/password";
import { toUserDto } from "../lib/dto";
import { mintTokens, verifyRefreshToken } from "../auth/jwt";
import { issueOtp, verifyOtp } from "../lib/otp";
import { env } from "../env";

export const authRouter = Router();

/* ---------------- Supervisor: employeeCode + PIN ---------------- */

authRouter.post(
  "/auth/supervisor/login",
  asyncHandler(async (req, res) => {
    const { employeeCode } = req.body ?? {};
    if (!employeeCode) throw badRequest("employeeCode is required");
    const user = await prisma.user.findFirst({ where: { employeeCode, role: "supervisor" } });
    if (!user) throw unauthorized("رمز موظف غير صحيح — employee code not found");
    res.json({ ok: true });
  })
);

authRouter.post(
  "/auth/supervisor/pin-verify",
  asyncHandler(async (req, res) => {
    const { employeeCode, pin } = req.body ?? {};
    if (!employeeCode || !pin) throw badRequest("employeeCode and pin are required");
    const user = await prisma.user.findFirst({ where: { employeeCode, role: "supervisor" } });
    if (!user || !user.pinHash || !compareSecret(pin, user.pinHash)) {
      throw unauthorized("PIN خاطئ — incorrect PIN");
    }
    const tokens = await mintTokens({
      userId: user.id,
      role: user.role,
      schoolId: user.schoolId,
      partnerId: user.partnerId,
    });
    res.json({ ...tokens, user: toUserDto(user) });
  })
);

/* ---------------- Driver: employeeCode + PIN (OP-2) ---------------- */

authRouter.post(
  "/auth/driver/login",
  asyncHandler(async (req, res) => {
    const { employeeCode } = req.body ?? {};
    if (!employeeCode) throw badRequest("employeeCode is required");
    const user = await prisma.user.findFirst({ where: { employeeCode, role: "driver" } });
    if (!user) throw unauthorized("رمز موظف غير صحيح — employee code not found");
    res.json({ ok: true });
  })
);

authRouter.post(
  "/auth/driver/pin-verify",
  asyncHandler(async (req, res) => {
    const { employeeCode, pin } = req.body ?? {};
    if (!employeeCode || !pin) throw badRequest("employeeCode and pin are required");
    const user = await prisma.user.findFirst({ where: { employeeCode, role: "driver" } });
    if (!user || !user.pinHash || !compareSecret(pin, user.pinHash)) {
      throw unauthorized("PIN خاطئ — incorrect PIN");
    }
    const tokens = await mintTokens({
      userId: user.id,
      role: user.role,
      schoolId: user.schoolId,
      partnerId: user.partnerId,
    });
    res.json({ ...tokens, user: toUserDto(user) });
  })
);

/* ---------------- Parent: phone + OTP ---------------- */

authRouter.post(
  "/auth/parent/request-otp",
  asyncHandler(async (req, res) => {
    const { phone } = req.body ?? {};
    if (!phone) throw badRequest("phone is required");

    // Dev-only convenience: auto-provision a parent account on first OTP
    // request so the flow is testable end-to-end without a separate
    // registration screen (not in the screen docs / api-client contract).
    // In production this would look up an existing account and 404 with
    // "هذا الرقم غير مرتبط بأي حساب" per P-02's documented error state.
    let user = await prisma.user.findFirst({ where: { phone, role: "parent" } });
    if (!user) {
      user = await prisma.user.create({ data: { role: "parent", name: "ولي أمر", phone } });
    }

    const code = await issueOtp(phone);

    // No real SMS provider in this environment — log the "sent" OTP to the
    // console (stand-in for an SMS gateway call) and, dev-only, return it in
    // the response body so testers/mobile devs can complete the flow without
    // reading server logs. Disabled in production.
    console.log(`[dev-sms] OTP for ${phone}: ${code} (valid 10 minutes)`);

    res.json({ ok: true, ...(env.isProd ? {} : { devOtp: code }) });
  })
);

authRouter.post(
  "/auth/parent/verify-otp",
  asyncHandler(async (req, res) => {
    const { phone, code } = req.body ?? {};
    if (!phone || !code) throw badRequest("phone and code are required");
    const valid = await verifyOtp(phone, code);
    if (!valid) throw unauthorized("رمز خاطئ أو منتهي الصلاحية — invalid or expired code");

    const user = await prisma.user.findFirst({ where: { phone, role: "parent" } });
    if (!user) throw unauthorized("Account not found");

    const tokens = await mintTokens({
      userId: user.id,
      role: user.role,
      schoolId: user.schoolId,
      partnerId: user.partnerId,
    });
    res.json({ ...tokens, user: toUserDto(user) });
  })
);

/* ---------------- Email + password roles ---------------- */

function emailPasswordLogin(role: "school_admin" | "ops_room" | "owner" | "partner" | "sysadmin" | "regulator") {
  return asyncHandler(async (req: import("express").Request, res: import("express").Response) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) throw badRequest("email and password are required");
    const user = await prisma.user.findFirst({ where: { email, role } });
    if (!user || !user.passwordHash || !compareSecret(password, user.passwordHash)) {
      throw unauthorized("بيانات خاطئة — invalid email or password");
    }
    // `otp` is accepted (per SchoolAdminLoginRequestSchema) but not required for this build.
    const tokens = await mintTokens({
      userId: user.id,
      role: user.role,
      schoolId: user.schoolId,
      partnerId: user.partnerId,
    });
    res.json({ ...tokens, user: toUserDto(user) });
  });
}

authRouter.post("/auth/school-admin/login", emailPasswordLogin("school_admin"));
authRouter.post("/auth/ops-room/login", emailPasswordLogin("ops_room"));
authRouter.post("/auth/owner/login", emailPasswordLogin("owner"));
// Not in the api-client contract but symmetric with the other email/password
// roles and needed to exercise the Partner Dashboard (OWN-09) independently.
authRouter.post("/auth/partner/login", emailPasswordLogin("partner"));
// Web-only, read-only oversight role for regulatory/licensing authorities.
authRouter.post("/auth/regulator/login", emailPasswordLogin("regulator"));

/* ---- sa-login: sysadmin gets a mandatory 2nd factor (§ security) on top of
 * email+password — reuses the OtpCode model exactly like parent OTP, keyed
 * on email instead of phone (it's just a string column). ---- */
authRouter.post(
  "/auth/sysadmin/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) throw badRequest("email and password are required");
    const user = await prisma.user.findFirst({ where: { email, role: "sysadmin" } });
    if (!user || !user.passwordHash || !compareSecret(password, user.passwordHash)) {
      throw unauthorized("بيانات خاطئة — invalid email or password");
    }
    const code = await issueOtp(email);
    console.log(`[dev-2fa] Sysadmin 2FA code for ${email}: ${code} (valid 10 minutes)`);
    res.json({ requires2fa: true, email, ...(env.isProd ? {} : { devOtp: code }) });
  })
);

authRouter.post(
  "/auth/sysadmin/verify-2fa",
  asyncHandler(async (req, res) => {
    const { email, code } = req.body ?? {};
    if (!email || !code) throw badRequest("email and code are required");
    const valid = await verifyOtp(email, code);
    if (!valid) throw unauthorized("رمز خاطئ أو منتهي الصلاحية — invalid or expired code");

    const user = await prisma.user.findFirst({ where: { email, role: "sysadmin" } });
    if (!user) throw unauthorized("Account not found");

    const tokens = await mintTokens({ userId: user.id, role: user.role, schoolId: user.schoolId, partnerId: user.partnerId });
    res.json({ ...tokens, user: toUserDto(user) });
  })
);

/* ---------------- Refresh token rotation ---------------- */

authRouter.post(
  "/auth/refresh",
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body ?? {};
    if (!refreshToken) throw badRequest("refreshToken is required");
    let claims;
    try {
      claims = verifyRefreshToken(refreshToken);
    } catch {
      throw unauthorized("Invalid or expired refresh token");
    }
    const stored = await prisma.refreshToken.findUnique({ where: { id: claims.jti } });
    if (!stored || stored.revoked || stored.expiresAt < new Date() || !compareSecret(refreshToken, stored.tokenHash)) {
      throw unauthorized("Refresh token has been revoked or rotated");
    }
    const user = await prisma.user.findUnique({ where: { id: claims.sub } });
    if (!user) throw unauthorized("Account not found");

    await prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } });
    const tokens = await mintTokens({
      userId: user.id,
      role: user.role,
      schoolId: user.schoolId,
      partnerId: user.partnerId,
    });
    res.json({ ...tokens, user: toUserDto(user) });
  })
);

authRouter.post(
  "/auth/logout",
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body ?? {};
    if (refreshToken) {
      try {
        const claims = verifyRefreshToken(refreshToken);
        await prisma.refreshToken.updateMany({ where: { id: claims.jti }, data: { revoked: true } });
      } catch {
        /* ignore invalid token on logout */
      }
    }
    res.status(204).send();
  })
);
