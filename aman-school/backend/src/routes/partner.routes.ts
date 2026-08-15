import { Router } from "express";
import { prisma } from "../prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { authenticate, requireRole } from "../auth/middleware";
import { badRequest, forbidden, notFound } from "../lib/errors";

export const partnerRouter = Router();
partnerRouter.use(authenticate);

/* ---- OWN-09: a partner's own dashboard — their schools + commission only ---- */
partnerRouter.get(
  "/partners/:id/dashboard",
  requireRole("partner", "owner"),
  asyncHandler(async (req, res) => {
    if (req.user!.role === "partner" && req.user!.partnerId !== req.params.id) throw forbidden();

    const partner = await prisma.partner.findUnique({
      where: { id: req.params.id },
      include: { schools: { include: { package: true } }, tier: true },
    });
    if (!partner) throw notFound("Partner");

    const monthlyRevenue = partner.schools
      .filter((s) => s.subscriptionStatus === "active" && s.package)
      .reduce((sum, s) => sum + (s.package?.priceMonthly ?? 0), 0);
    const commission = monthlyRevenue * (partner.commissionPercent / 100);

    res.json({ partner, monthlyRevenue, commission, schoolsCount: partner.schools.length });
  })
);

/* ---- partner-leads (§11): a partner's own sales pipeline ---- */
partnerRouter.get(
  "/partners/:id/leads",
  requireRole("partner", "owner"),
  asyncHandler(async (req, res) => {
    if (req.user!.role === "partner" && req.user!.partnerId !== req.params.id) throw forbidden();
    const leads = await prisma.lead.findMany({ where: { partnerId: req.params.id }, orderBy: { createdAt: "desc" } });
    res.json(leads);
  })
);

partnerRouter.post(
  "/partners/:id/leads",
  requireRole("partner"),
  asyncHandler(async (req, res) => {
    if (req.user!.partnerId !== req.params.id) throw forbidden();
    const { schoolName, contactName, phone, notes } = req.body ?? {};
    if (!schoolName || !contactName || !phone) throw badRequest("schoolName, contactName and phone are required");
    const lead = await prisma.lead.create({
      data: { partnerId: req.params.id, schoolName, contactName, phone, notes: notes ?? null },
    });
    res.status(201).json(lead);
  })
);

partnerRouter.put(
  "/partners/:id/leads/:leadId",
  requireRole("partner"),
  asyncHandler(async (req, res) => {
    if (req.user!.partnerId !== req.params.id) throw forbidden();
    const lead = await prisma.lead.findUnique({ where: { id: req.params.leadId } });
    if (!lead || lead.partnerId !== req.params.id) throw notFound("Lead");
    const { stage, notes } = req.body ?? {};
    const updated = await prisma.lead.update({
      where: { id: lead.id },
      data: { stage: stage ?? undefined, notes: notes !== undefined ? notes : undefined },
    });
    res.json(updated);
  })
);
