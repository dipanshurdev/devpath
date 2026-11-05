import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { requireAuth } from "@/lib/auth-utils";
import { withErrorHandler, createApiResponse } from "@/lib/api-handler";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

/**
 * GET /api/achievements
 * Returns all achievements with unlock status for the current user.
 */
export const GET = withErrorHandler(async (_request: NextRequest) => {
  const { session, response } = await requireAuth();
  if (response) return response;

  // Get all achievements from DB
  const [allAchievements, userAchievements] = await Promise.all([
    prisma.achievement.findMany({ orderBy: [{ category: "asc" }, { points: "asc" }] }),
    prisma.userAchievement.findMany({
      where: { userId: session.user.id },
      select: { achievementId: true, unlockedAt: true },
    }),
  ]);

  const unlockedMap = new Map(
    userAchievements.map((ua) => [ua.achievementId, ua.unlockedAt])
  );

  const achievements = allAchievements.map((a) => ({
    ...a,
    unlocked: unlockedMap.has(a.id),
    unlockedAt: unlockedMap.get(a.id) ?? null,
  }));

  const stats = {
    total: achievements.length,
    unlocked: userAchievements.length,
    totalPoints: achievements
      .filter((a) => a.unlocked)
      .reduce((sum, a) => sum + a.points, 0),
  };

  return createApiResponse({ achievements, stats });
});
