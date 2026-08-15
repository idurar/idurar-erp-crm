import { NextFunction, Request, Response } from "express";
import type { JwtClaims, Role } from "@aman-school/types";
import { verifyAccessToken } from "./jwt";
import { unauthorized, forbidden } from "../lib/errors";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtClaims;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(unauthorized("Missing bearer token"));
  }
  const token = header.slice("Bearer ".length);
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(unauthorized("Invalid or expired token"));
  }
}

/** Restricts a route to a set of roles. Call after `authenticate`. */
export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(unauthorized());
    if (!roles.includes(req.user.role)) return next(forbidden(`Requires role: ${roles.join(", ")}`));
    next();
  };
}

/** Owner/partner bypass tenant scoping by design; everyone else must match schoolId. */
export function assertSchoolAccess(user: JwtClaims, schoolId: string) {
  if (user.role === "owner" || user.role === "partner") return;
  if (user.schoolId !== schoolId) throw forbidden();
}
