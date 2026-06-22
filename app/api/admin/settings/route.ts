/**
 * Admin Platform Settings API
 *
 * GET /api/admin/settings
 *   Returns current platform configuration including subscription tier limits,
 *   feature gates, pagination defaults, cache TTLs, and gamification points.
 *   These values are derived from lib/config.ts (non-secret, runtime-readable
 *   configuration) and lib/feature-gates.ts (subscription feature definitions).
 *
 *   Live DB counts (user distribution by role, subscription tier breakdown) are
 *   appended so the admin UI has an at-a-glance view of the platform state.
 *
 * Requires ADMIN or SUPER_ADMIN role.
 */

import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma/client";
import { withErrorHandler, createApiResponse } from "@/lib/api-handler";
import { logger } from "@/lib/logger";
import { config } from "@/lib/config";
import { FEATURES, SUBSCRIPTION_TIERS, FEATURE_LIST, TIER_LIST } from "@/lib/feature-gates";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

export const GET = withErrorHandler(async (_request: NextRequest) => {
  const { session, response } = await requireAdmin();
  if (response) return response;

  logger.info({
    route: "/api/admin/settings",
    method: "GET",
    message: "Admin accessed platform settings",
    adminId: session.user.id,
    adminRole: session.user.role,
  });

  // Live DB snapshots — cheap groupBy aggregates
  const [usersByRole, usersBySubscriptionTier] = await Promise.all([
    prisma.user.groupBy({
      by: ["role"],
      _count: { _all: true },
    }),
    prisma.subscription.groupBy({
      by: ["tier", "status"],
      _count: { _all: true },
    }),
  ]);

  const settings = {
    // -----------------------------------------------------------------
    // Pagination defaults (from lib/config.ts)
    // -----------------------------------------------------------------
    pagination: config.pagination,

    // -----------------------------------------------------------------
    // Cache TTLs (from lib/config.ts)
    // -----------------------------------------------------------------
    cache: config.cache,

    // -----------------------------------------------------------------
    // Gamification point values (from lib/config.ts)
    // -----------------------------------------------------------------
    points: config.points,

    // -----------------------------------------------------------------
    // Subscription tier limits (from lib/config.ts)
    // -----------------------------------------------------------------
    subscriptionTiers: config.subscriptionTiers,

    // -----------------------------------------------------------------
    // Feature gates: minimum tier per feature (from lib/config.ts)
    // -----------------------------------------------------------------
    featureGates: config.featureGates,

    // -----------------------------------------------------------------
    // Feature definitions (from lib/feature-gates.ts)
    // These represent all named features the platform recognises.
    // -----------------------------------------------------------------
    featureDefinitions: {
      features: FEATURES,
      featureList: FEATURE_LIST,
      subscriptionTierDefinitions: SUBSCRIPTION_TIERS,
      tierList: TIER_LIST,
    },

    // -----------------------------------------------------------------
    // Live platform snapshot (DB-backed, always fresh)
    // -----------------------------------------------------------------
    platformSnapshot: {
      usersByRole: Object.fromEntries(
        usersByRole.map((r) => [r.role, r._count._all]),
      ),
      subscriptions: usersBySubscriptionTier.map((s) => ({
        tier: s.tier,
        status: s.status,
        count: s._count._all,
      })),
    },
  };

  return createApiResponse(settings);
});
