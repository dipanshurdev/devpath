import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma/client";
import Stripe from "stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/stripe/webhook
 * Handles Stripe webhook events to sync subscription state.
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error("[stripe/webhook] Missing signature or webhook secret");
    return NextResponse.json({ error: "Webhook configuration error" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[stripe/webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`[stripe/webhook] Event: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        await handleCheckoutCompleted(session);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        await handlePaymentFailed(invoice);
        break;
      }
      default:
        console.log(`[stripe/webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error(`[stripe/webhook] Error handling event ${event.type}:`, err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ── Event handlers ───────────────────────────────────────────────────────────

async function handleCheckoutCompleted(session: any) {
  const userId = session.metadata?.userId;
  const tier = session.metadata?.tier as "PRO" | "TEAM" | undefined;

  if (!userId || !tier) {
    console.error("[stripe/webhook] Missing userId or tier in session metadata");
    return;
  }

  // Retrieve the full subscription from Stripe
  const stripeSubscription: any = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  const periodEnd = stripeSubscription.current_period_end
    ? new Date(stripeSubscription.current_period_end * 1000)
    : null;

  await prisma.subscription.update({
    where: { userId },
    data: {
      tier,
      status: "ACTIVE",
      externalId: stripeSubscription.id,
      currentPeriodStart: stripeSubscription.current_period_start
        ? new Date(stripeSubscription.current_period_start * 1000)
        : new Date(),
      currentPeriodEnd: periodEnd,
    },
  });

  console.log(`[stripe/webhook] Activated ${tier} for user ${userId}`);

  // Send confirmation email (non-blocking)
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });
    if (user) {
      const { sendSubscriptionConfirmationEmail } = await import("@/lib/email");
      sendSubscriptionConfirmationEmail(user.email, user.name, tier).catch(console.error);
    }
  } catch (err) {
    console.error("[stripe/webhook] Email error:", err);
  }
}

async function handleSubscriptionUpdated(stripeSubscription: any) {
  const userId = stripeSubscription.metadata?.userId;
  if (!userId) return;

  const tier = stripeSubscription.metadata?.tier as "PRO" | "TEAM" | undefined;
  const status = mapStripeStatus(stripeSubscription.status);
  const periodEnd = stripeSubscription.current_period_end
    ? new Date(stripeSubscription.current_period_end * 1000)
    : null;

  await prisma.subscription.update({
    where: { userId },
    data: {
      ...(tier && { tier }),
      status,
      currentPeriodEnd: periodEnd,
      externalId: stripeSubscription.id,
    },
  });

  console.log(`[stripe/webhook] Updated subscription for user ${userId}: ${status}`);
}

async function handleSubscriptionDeleted(stripeSubscription: any) {
  const userId = stripeSubscription.metadata?.userId;
  if (!userId) return;

  const periodEnd = stripeSubscription.current_period_end
    ? new Date(stripeSubscription.current_period_end * 1000)
    : new Date();

  await prisma.subscription.update({
    where: { userId },
    data: {
      tier: "FREE",
      status: "CANCELLED",
      currentPeriodEnd: periodEnd,
    },
  });

  console.log(`[stripe/webhook] Cancelled subscription for user ${userId}`);

  // Send cancellation email (non-blocking)
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });
    if (user) {
      const { sendSubscriptionCancelledEmail } = await import("@/lib/email");
      sendSubscriptionCancelledEmail(user.email, user.name, periodEnd).catch(console.error);
    }
  } catch (err) {
    console.error("[stripe/webhook] Email error:", err);
  }
}

async function handlePaymentFailed(invoice: any) {
  const customerId = invoice.customer as string;

  const subscription = await prisma.subscription.findFirst({
    where: { externalId: { startsWith: customerId } },
    select: { userId: true },
  }).catch(() => null);

  if (!subscription) return;

  await prisma.subscription.update({
    where: { userId: subscription.userId },
    data: { status: "PAST_DUE" },
  });

  console.log(`[stripe/webhook] Payment failed for user ${subscription.userId}`);
}

function mapStripeStatus(
  stripeStatus: Stripe.Subscription.Status
): "ACTIVE" | "CANCELLED" | "PAST_DUE" {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return "ACTIVE";
    case "past_due":
    case "unpaid":
      return "PAST_DUE";
    case "canceled":
    case "incomplete_expired":
      return "CANCELLED";
    default:
      return "PAST_DUE";
  }
}
