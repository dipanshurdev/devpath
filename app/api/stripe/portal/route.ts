import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { withErrorHandler, ApiError, createApiResponse } from "@/lib/api-handler";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma/client";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/stripe/portal
 * Creates a Stripe Customer Portal session for managing subscriptions.
 */
export const POST = withErrorHandler(async (_request: NextRequest) => {
  const { session, response } = await requireAuth();
  if (response) return response;

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    select: { externalId: true, tier: true },
  });

  if (!subscription?.externalId) {
    throw ApiError.badRequest("No active subscription found.");
  }

  // Get customer ID — could be stored as customer ID or subscription ID
  let customerId = subscription.externalId;
  if (customerId.startsWith("sub_")) {
    // Look up customer from subscription
    const stripeSub = await stripe.subscriptions.retrieve(customerId);
    customerId = stripeSub.customer as string;
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${APP_URL}/pricing/dashboard`,
  });

  return createApiResponse({ url: portalSession.url });
});
