import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import type { JwtClaims, Role } from "@aman-school/types";
import { env } from "../env";
import { prisma } from "../prisma";
import { hashSecret } from "../lib/password";

const ACCESS_TOKEN_TTL = "1h";
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const REFRESH_TOKEN_TTL_STR = "30d";

export interface MintedTokens {
  accessToken: string;
  refreshToken: string;
}

export function signAccessToken(claims: JwtClaims): string {
  return jwt.sign(claims, env.jwtAccessSecret, { expiresIn: ACCESS_TOKEN_TTL });
}

/** owner-impersonate (§13): a short-lived access token for a support session
 * as another user, with no refresh token (it's meant to expire, not renew).
 * `impersonatedByUserId` rides along in the JWT so any request made under it
 * can be traced back to the owner who started the session. */
export function signImpersonationToken(claims: JwtClaims, impersonatedByUserId: string, ttlSeconds: number): string {
  return jwt.sign({ ...claims, impersonatedByUserId }, env.jwtAccessSecret, { expiresIn: ttlSeconds });
}

function signRefreshToken(claims: JwtClaims, jti: string): string {
  return jwt.sign({ ...claims, jti }, env.jwtRefreshSecret, { expiresIn: REFRESH_TOKEN_TTL_STR });
}

/** Mints an access+refresh token pair for a user and persists the refresh token (hashed) for rotation. */
export async function mintTokens(params: {
  userId: string;
  role: Role;
  schoolId: string | null;
  partnerId: string | null;
}): Promise<MintedTokens> {
  const claims: JwtClaims = {
    sub: params.userId,
    role: params.role,
    schoolId: params.schoolId,
    partnerId: params.partnerId,
    tenantVersion: 1,
  };

  const jti = uuid();
  const accessToken = signAccessToken(claims);
  const refreshToken = signRefreshToken(claims, jti);

  await prisma.refreshToken.create({
    data: {
      id: jti,
      userId: params.userId,
      tokenHash: hashSecret(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): JwtClaims {
  return jwt.verify(token, env.jwtAccessSecret) as JwtClaims;
}

export function verifyRefreshToken(token: string): JwtClaims & { jti: string } {
  return jwt.verify(token, env.jwtRefreshSecret) as JwtClaims & { jti: string };
}
