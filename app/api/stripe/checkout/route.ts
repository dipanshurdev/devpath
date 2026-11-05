import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { withErrorHandler, ApiError, createApiResponse } from "@/lib/api-handler";
import { stripe, getPriceId } from "@/lib/stripe";
import { prisma } from "@/lib/prisma/client";
import { z } from "zod";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const schema = z.object({
  tier: z.enum(["PRO", "TEAM"]),
  yearly: z.boolean().optional().default(false),
});

/**
 * POST /api/stripe/checkout
 * Creates a Stripe Checkout Session and returns the URL.
 */
export const POST = withErrorHandler(async (request: NextRequest) => {
  const { session, response } = await requireAuth();
  if (response) return response;

  const body = await request.json();
  const { tier, yearly } = schema.parse(body);

  const priceId = getPriceId(tier, yearly);
  if (!priceId) {
    throw ApiError.internal(
      `Price ID for ${tier} ${yearly ? "yearly" : "monthly"} is not configured. Set STRIPE_${tier}_${yearly ? "YEARLY" : "MONTHLY"}_PRICE_ID in your environment.`
    );
  }

  // Get or create Stripe customer
  let customerId: string | undefined;
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    select: { externalId: true },
  });

  if (subscription?.externalId) {
    // Check if it's a customer ID (starts with cus_) vs subscription ID
    if (subscription.externalId.startsWith("cus_")) {
      customerId = subscription.externalId;
    }
  }

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      name: session.user.name,
      metadata: { userId: session.user.id },
    });
    customerId = customer.id;

    // Store customer ID
    await prisma.subscription.update({
      where: { userId: session.user.id },
      data: { externalId: customer.id },
    });
  }

  // Create Checkout Session
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${APP_URL}/pricing/dashboard?success=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/pricing?cancelled=1`,
    metadata: {
      userId: session.user.id,
      tier,
    },
    subscription_data: {
      metadata: {
        userId: session.user.id,
        tier,
      },
    },
    allow_promotion_codes: true,
  });

  return createApiResponse({ url: checkoutSession.url });
});
