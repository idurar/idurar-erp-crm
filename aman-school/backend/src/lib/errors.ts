import { NextFunction, Request, Response } from "express";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function notFound(entity = "Resource"): ApiError {
  return new ApiError(404, `${entity} not found`);
}

export function forbidden(message = "Forbidden — cross-tenant access denied"): ApiError {
  return new ApiError(403, message);
}

export function unauthorized(message = "Unauthorized"): ApiError {
  return new ApiError(401, message);
}

export function badRequest(message: string, details?: unknown): ApiError {
  return new ApiError(400, message, details);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.message, details: err.details ?? undefined });
  }
  console.error("Unhandled error:", err);
  return res.status(500).json({ error: "Internal server error" });
}
