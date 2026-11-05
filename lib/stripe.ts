/**
 * Stripe singleton.
 * Import `stripe` for server-side Stripe API calls.
 * Import `getStripe` for client-side Stripe.js (checkout redirect).
 */

import Stripe from "stripe";

// Server-side Stripe instance with build-time fallback to prevent initialization crashes
const stripeApiKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_for_build";

export const stripe = new Stripe(stripeApiKey, {
  apiVersion: "2026-10-28.endive" as any,
  typescript: true,
});

// ── Price IDs ─────────────────────────────────────────────────────────────
// Set these in your .env after creating products in Stripe Dashboard.

export const STRIPE_PRICES = {
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? "",
  PRO_YEARLY: process.env.STRIPE_PRO_YEARLY_PRICE_ID ?? "",
  TEAM_MONTHLY: process.env.STRIPE_TEAM_MONTHLY_PRICE_ID ?? "",
  TEAM_YEARLY: process.env.STRIPE_TEAM_YEARLY_PRICE_ID ?? "",
} as const;

export type PriceKey = keyof typeof STRIPE_PRICES;

// Map tier + billing cycle to price ID
export function getPriceId(tier: "PRO" | "TEAM", yearly: boolean): string {
  if (tier === "PRO") return yearly ? STRIPE_PRICES.PRO_YEARLY : STRIPE_PRICES.PRO_MONTHLY;
  return yearly ? STRIPE_PRICES.TEAM_YEARLY : STRIPE_PRICES.TEAM_MONTHLY;
}
