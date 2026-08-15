import { Router } from "express";
import { prisma } from "../prisma";
import { asyncHandler } from "../lib/asyncHandler";
import { authenticate, requireRole } from "../auth/middleware";
import { badRequest, forbidden, notFound } from "../lib/errors";
import { PARENT_PACKAGE_TIERS, SCHOOL_PACKAGE_TIERS } from "@aman-school/types";
import { buildInvoiceNumber } from "../lib/codes";

export const subscriptionsRouter = Router();
subscriptionsRouter.use(authenticate);

/* ---- BC-6: sequential invoice numbering — never reused, even across restarts ---- */
async function nextInvoiceNumber(): Promise<string> {
  const count = await prisma.invoice.count();
  return buildInvoiceNumber(count + 1);
}

/* ---- G-3/subscribe: canonical Yemen pricing for both audiences ---- */
subscriptionsRouter.get(
  "/packages/catalog",
  asyncHandler(async (req, res) => {
    const audience = (req.query.audience as string) ?? "parent";
    res.json(audience === "school" ? SCHOOL_PACKAGE_TIERS : PARENT_PACKAGE_TIERS);
  })
);

/* ---- P-6: a parent's own current subscription status ---- */
subscriptionsRouter.get(
  "/parents/:id/subscription",
  asyncHandler(async (req, res) => {
    if (req.user!.role === "parent" && req.user!.sub !== req.params.id) throw forbidden();
    const parent = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!parent) throw notFound("Parent");
    res.json({ tier: parent.subscriptionTier, endsAt: parent.subscriptionEndsAt });
  })
);

/* ---- P-6: a parent chooses/changes their subscription tier ---- */
subscriptionsRouter.post(
  "/parents/:id/subscription",
  asyncHandler(async (req, res) => {
    if (req.user!.role !== "parent" || req.user!.sub !== req.params.id) throw forbidden();
    const { tier, cycle } = req.body ?? {};
    const plan = PARENT_PACKAGE_TIERS.find((p) => p.tier === tier);
    if (!plan) throw badRequest("Unknown package tier");

    const days = cycle === "yearly" ? 365 : cycle === "quarterly" ? 90 : 30;
    const endsAt = new Date(Date.now() + days * 86400000);
    await prisma.user.update({
      where: { id: req.params.id },
      data: { subscriptionTier: plan.name, subscriptionEndsAt: endsAt },
    });
    res.json({ ok: true, tier: plan.name, endsAt });
  })
);

/* ---- G-4/payment: submit a payment (dev-auto-confirmed, no real gateway) ---- */
subscriptionsRouter.post(
  "/payments",
  asyncHandler(async (req, res) => {
    const { subjectType, subjectId, packageName, cycle, amount, method, receiptUrl } = req.body ?? {};
    if (!subjectType || !subjectId || !packageName || !cycle || !amount || !method) {
      throw badRequest("subjectType, subjectId, packageName, cycle, amount and method are required");
    }
    if (subjectType === "parent" && req.user!.sub !== subjectId) throw forbidden();

    const payment = await prisma.payment.create({
      data: {
        subjectType,
        parentUserId: subjectType === "parent" ? subjectId : null,
        schoolId: subjectType === "school" ? subjectId : null,
        packageName,
        cycle,
        amount,
        method,
        receiptUrl: receiptUrl ?? null,
        // No real payment gateway is integrated in this build — submissions are
        // auto-confirmed the same way OTP is dev-shortcut (see auth.routes.ts).
        // Production would leave this "pending" until eCash/bank-transfer/cash
        // is manually reconciled by an operator.
        status: "confirmed",
        confirmedAt: new Date(),
      },
    });

    // BC-6: every confirmed payment produces a real, sequentially-numbered invoice.
    await prisma.invoice.create({
      data: {
        invoiceNumber: await nextInvoiceNumber(),
        schoolId: subjectType === "school" ? subjectId : null,
        subjectType,
        parentUserId: subjectType === "parent" ? subjectId : null,
        amount,
        description: `اشتراك ${packageName} — ${cycle === "yearly" ? "سنوي" : cycle === "quarterly" ? "ربع سنوي" : "شهري"}`,
        status: "paid",
        method,
        issuedAt: new Date(),
        dueAt: new Date(),
        paidAt: new Date(),
      },
    });
    res.status(201).json(payment);
  })
);

subscriptionsRouter.get(
  "/parents/:id/payments",
  asyncHandler(async (req, res) => {
    if (req.user!.role === "parent" && req.user!.sub !== req.params.id) throw forbidden();
    const payments = await prisma.payment.findMany({ where: { parentUserId: req.params.id }, orderBy: { createdAt: "desc" } });
    res.json(payments);
  })
);

subscriptionsRouter.get(
  "/schools/:id/payments",
  asyncHandler(async (req, res) => {
    const school = await prisma.school.findUnique({ where: { id: req.params.id } });
    if (!school) throw notFound("School");
    const payments = await prisma.payment.findMany({ where: { schoolId: req.params.id }, orderBy: { createdAt: "desc" } });
    res.json(payments);
  })
);

/* ---- BC-6: invoices ---- */
subscriptionsRouter.get(
  "/parents/:id/invoices",
  asyncHandler(async (req, res) => {
    if (req.user!.role === "parent" && req.user!.sub !== req.params.id) throw forbidden();
    res.json(await prisma.invoice.findMany({ where: { parentUserId: req.params.id }, orderBy: { issuedAt: "desc" } }));
  })
);

subscriptionsRouter.get(
  "/schools/:id/invoices",
  asyncHandler(async (req, res) => {
    const school = await prisma.school.findUnique({ where: { id: req.params.id } });
    if (!school) throw notFound("School");
    res.json(await prisma.invoice.findMany({ where: { schoolId: req.params.id }, orderBy: { issuedAt: "desc" } }));
  })
);

/* ---- BC-5: request a pro-rata refund/settlement (mid-cycle downgrade/cancel) ---- */
subscriptionsRouter.post(
  "/refunds/request",
  asyncHandler(async (req, res) => {
    const { subjectType, subjectId, reason, amountPaid, amountOwed } = req.body ?? {};
    if (!subjectType || !subjectId || !reason || amountPaid == null || amountOwed == null) {
      throw badRequest("subjectType, subjectId, reason, amountPaid and amountOwed are required");
    }
    if (subjectType === "parent" && req.user!.sub !== subjectId) throw forbidden();

    const refundAmount = Math.max(0, amountPaid - amountOwed);
    const refund = await prisma.refund.create({
      data: {
        subjectType,
        schoolId: subjectType === "school" ? subjectId : null,
        parentUserId: subjectType === "parent" ? subjectId : null,
        reason, amountPaid, amountOwed, refundAmount,
      },
    });
    res.status(201).json(refund);
  })
);

/* ---- BC-7: payment gateway transparency, admin-managed via ow-settings ---- */
subscriptionsRouter.get(
  "/payments/gateway-status",
  asyncHandler(async (_req, res) => {
    const settings = await prisma.platformSettings.findUnique({ where: { id: "singleton" } });
    const data = (settings?.data as any) ?? {};
    res.json(
      data.paymentGateways ?? {
        bank_transfer: { status: "instant_verify", note: "يُفعَّل فوراً عند رفع صورة إيصال واضحة، ويُراجَع خلال ساعة كحد أقصى" },
        cash: { status: "instant", note: "نقداً للمندوب" },
        ecash: { status: "near_instant", note: "تفعيل خلال ساعة" },
        yemenpay: { status: "integrating", note: "نعمل على الدمج المباشر" },
      }
    );
  })
);

/* ---- BC-3: subscription lifecycle policy (owner-configured) ---- */
subscriptionsRouter.get(
  "/subscriptions/lifecycle-policy",
  asyncHandler(async (_req, res) => {
    const settings = await prisma.platformSettings.findUnique({ where: { id: "singleton" } });
    const data = (settings?.data as any) ?? {};
    res.json(
      data.subscriptionLifecyclePolicy ?? {
        reminderDaysBefore: [30, 7, 0],
        schoolGraceDays: 7,
        parentGraceDays: 3,
        postGraceAction: "restricted", // suspended | restricted
        autoRenewDefault: true,
      }
    );
  })
);

subscriptionsRouter.put(
  "/subscriptions/lifecycle-policy",
  requireRole("owner"),
  asyncHandler(async (req, res) => {
    const settings = await prisma.platformSettings.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton", data: {} },
    });
    const data = (settings.data as any) ?? {};
    const updated = await prisma.platformSettings.update({
      where: { id: "singleton" },
      data: { data: { ...data, subscriptionLifecyclePolicy: req.body ?? {} } },
    });
    res.json((updated.data as any).subscriptionLifecyclePolicy);
  })
);
