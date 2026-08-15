import { Router } from "express";
import { prisma } from "../prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { authenticate } from "../auth/middleware";
import { badRequest } from "../lib/errors";
import { CURRENT_CONSENT_VERSION } from "@aman-school/types";

export const consentRouter = Router();
consentRouter.use(authenticate);

/* ---- SF-1: mandatory, once-per-policy-version privacy/tracking/medical consent ---- */
consentRouter.get(
  "/consent/status",
  asyncHandler(async (req, res) => {
    const latest = await prisma.consent.findFirst({
      where: { userId: req.user!.sub },
      orderBy: { createdAt: "desc" },
    });
    const upToDate = !!latest && latest.consentVersion === CURRENT_CONSENT_VERSION
      && latest.trackingConsent && latest.medicalConsent && latest.policyConsent;
    res.json({ required: !upToDate, currentVersion: CURRENT_CONSENT_VERSION, latest });
  })
);

consentRouter.post(
  "/consent/record",
  asyncHandler(async (req, res) => {
    const { trackingConsent, medicalConsent, policyConsent, appVersion } = req.body ?? {};
    if (!trackingConsent || !medicalConsent || !policyConsent) {
      throw badRequest("all three consents are required");
    }
    const record = await prisma.consent.create({
      data: {
        userId: req.user!.sub,
        trackingConsent: Boolean(trackingConsent),
        medicalConsent: Boolean(medicalConsent),
        policyConsent: Boolean(policyConsent),
        consentVersion: CURRENT_CONSENT_VERSION,
        appVersion: appVersion ?? null,
        ip: req.ip ?? null,
      },
    });
    res.status(201).json(record);
  })
);

/** Withdrawing consent = a new all-false record, which suspends the account. */
consentRouter.post(
  "/consent/withdraw",
  asyncHandler(async (req, res) => {
    await prisma.consent.create({
      data: {
        userId: req.user!.sub,
        trackingConsent: false,
        medicalConsent: false,
        policyConsent: false,
        consentVersion: CURRENT_CONSENT_VERSION,
      },
    });
    res.json({ ok: true });
  })
);
