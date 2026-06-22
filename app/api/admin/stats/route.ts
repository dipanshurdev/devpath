/**
 * Admin Dashboard Stats API
 *
 * GET /api/admin/stats
 *   Returns real-time counts for roadmaps, nodes, resources, and users,
 *   plus basic time-series data for signups and roadmap completions over
 *   the last 7 and 30 days.
 *
 *   All queries use Prisma count() and groupBy() — no external analytics
 *   infrastructure required.
 *
 * Requires ADMIN or SUPER_ADMIN role.
 *
 * Requirements: 5.4, 13.3
 */

import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma/client";
import { withErrorHandler, createApiResponse } from "@/lib/api-handler";
import { logger } from "@/lib/logger";
import { ActivityType } from "@prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

/** Build a Date that is `days` calendar days before now (start of that UTC day). */
function daysAgo(days: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Given a list of records that each have a `createdAt` (or `completedAt`)
 * Date and a `_count._all` number, produce a sorted array of { date, count }
 * covering every day in the window (filling missing days with 0).
 */
function buildDailySeries(
  grouped: { period: Date; count: number }[],
  windowDays: number,
): { date: string; count: number }[] {
  // Index by ISO date string (YYYY-MM-DD)
  const map = new Map<string, number>();
  for (const row of grouped) {
    const key = row.period.toISOString().slice(0, 10);
    map.set(key, (map.get(key) ?? 0) + row.count);
  }

  const result: { date: string; count: number }[] = [];
  for (let i = windowDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, count: map.get(key) ?? 0 });
  }
  return result;
}

export const GET = withErrorHandler(async (_request: NextRequest) => {
  const { session, response } = await requireAdmin();
  if (response) return response;

  logger.info({
    route: "/api/admin/stats",
    method: "GET",
    message: "Admin accessed platform stats",
    adminId: session.user.id,
    adminRole: session.user.role,
  });

  const now = new Date();
  const since7 = daysAgo(7);
  const since30 = daysAgo(30);

  const [
    // ── aggregate counts ──────────────────────────────────────────────
    roadmapCount,
    publishedRoadmapCount,
    nodeCount,
    resourceCount,
    userCount,
    activeUserCount7,
    activeUserCount30,
    commentCount,

    // ── time-series: signups ─────────────────────────────────────────
    signups7Raw,
    signups30Raw,

    // ── time-series: roadmap completions (Activity log) ──────────────
    completions7Raw,
    completions30Raw,

    // ── subscription breakdown ────────────────────────────────────────
    subscriptionBreakdown,
  ] = await Promise.all([
    // Total roadmaps
    prisma.roadmap.count(),
    // Published roadmaps
    prisma.roadmap.count({ where: { isPublished: true } }),
    // Total nodes
    prisma.node.count(),
    // Total resources
    prisma.resource.count(),
    // Total users
    prisma.user.count(),

    // Users active in last 7 days
    prisma.user.count({ where: { lastActive: { gte: since7 } } }),
    // Users active in last 30 days
    prisma.user.count({ where: { lastActive: { gte: since30 } } }),

    // Total comments
    prisma.comment.count(),

    // Signups last 7 days — groupBy day using createdAt
    prisma.user.findMany({
      where: { createdAt: { gte: since7 } },
      select: { createdAt: true },
    }),
    // Signups last 30 days
    prisma.user.findMany({
      where: { createdAt: { gte: since30 } },
      select: { createdAt: true },
    }),

    // Roadmap completions last 7 days (ROADMAP_COMPLETED activities)
    prisma.activity.findMany({
      where: {
        type: ActivityType.ROADMAP_COMPLETED,
        createdAt: { gte: since7 },
      },
      select: { createdAt: true },
    }),
    // Roadmap completions last 30 days
    prisma.activity.findMany({
      where: {
        type: ActivityType.ROADMAP_COMPLETED,
        createdAt: { gte: since30 },
      },
      select: { createdAt: true },
    }),

    // Subscription tier distribution
    prisma.subscription.groupBy({
      by: ["tier", "status"],
      _count: { _all: true },
    }),
  ]);

  // ── Convert raw findMany results to { period, count } arrays ────────
  // We bucket each record into its UTC calendar day.
  function toGrouped(rows: { createdAt: Date }[]): { period: Date; count: number }[] {
    const dayMap = new Map<string, { period: Date; count: number }>();
    for (const row of rows) {
      const d = new Date(row.createdAt);
      d.setUTCHours(0, 0, 0, 0);
      const key = d.toISOString();
      const existing = dayMap.get(key);
      if (existing) {
        existing.count++;
      } else {
        dayMap.set(key, { period: d, count: 1 });
      }
    }
    return Array.from(dayMap.values());
  }

  // ── Build daily series for each window ──────────────────────────────
  const signupSeries7 = buildDailySeries(toGrouped(signups7Raw), 7);
  const signupSeries30 = buildDailySeries(toGrouped(signups30Raw), 30);
  const completionSeries7 = buildDailySeries(toGrouped(completions7Raw), 7);
  const completionSeries30 = buildDailySeries(toGrouped(completions30Raw), 30);

  // ── Totals from the series ───────────────────────────────────────────
  const totalSignups7 = signupSeries7.reduce((s, r) => s + r.count, 0);
  const totalSignups30 = signupSeries30.reduce((s, r) => s + r.count, 0);
  const totalCompletions7 = completionSeries7.reduce((s, r) => s + r.count, 0);
  const totalCompletions30 = completionSeries30.reduce((s, r) => s + r.count, 0);

  return createApiResponse({
    // ── Aggregate counts (existing) ───────────────────────────────────
    roadmapCount,
    publishedRoadmapCount,
    nodeCount,
    resourceCount,
    userCount,
    commentCount,

    // ── Active users ──────────────────────────────────────────────────
    activeUsers: {
      last7Days: activeUserCount7,
      last30Days: activeUserCount30,
    },

    // ── Subscription breakdown ────────────────────────────────────────
    subscriptions: subscriptionBreakdown.map((s) => ({
      tier: s.tier,
      status: s.status,
      count: s._count._all,
    })),

    // ── Time-series ───────────────────────────────────────────────────
    timeSeries: {
      signups: {
        last7Days: {
          total: totalSignups7,
          daily: signupSeries7,
        },
        last30Days: {
          total: totalSignups30,
          daily: signupSeries30,
        },
      },
      roadmapCompletions: {
        last7Days: {
          total: totalCompletions7,
          daily: completionSeries7,
        },
        last30Days: {
          total: totalCompletions30,
          daily: completionSeries30,
        },
      },
    },

    // ── Metadata ─────────────────────────────────────────────────────
    generatedAt: now.toISOString(),
  });
});
