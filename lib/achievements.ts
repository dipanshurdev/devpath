/**
 * Achievement award engine.
 * Call `checkAndAwardAchievements(userId)` after any user action that might
 * unlock a new achievement (node completion, roadmap completion, etc).
 */

import { prisma } from "@/lib/prisma/client";

// ── Achievement definitions ─────────────────────────────────────────────────
// These mirror the seeds in scripts/seed-achievements.ts

export const ACHIEVEMENT_DEFINITIONS = [
  // Progress category
  {
    key: "first_step",
    name: "First Step",
    description: "Complete your first roadmap node.",
    icon: "CheckCircle2",
    category: "Progress",
    points: 10,
    rarity: "COMMON" as const,
    requirement: "Complete 1 node",
  },
  {
    key: "node_5",
    name: "Getting Serious",
    description: "Complete 5 roadmap nodes.",
    icon: "Zap",
    category: "Progress",
    points: 25,
    rarity: "COMMON" as const,
    requirement: "Complete 5 nodes",
  },
  {
    key: "node_25",
    name: "Knowledge Builder",
    description: "Complete 25 roadmap nodes.",
    icon: "BookOpen",
    category: "Progress",
    points: 50,
    rarity: "RARE" as const,
    requirement: "Complete 25 nodes",
  },
  {
    key: "node_100",
    name: "Century Club",
    description: "Complete 100 roadmap nodes.",
    icon: "Trophy",
    category: "Progress",
    points: 150,
    rarity: "EPIC" as const,
    requirement: "Complete 100 nodes",
  },
  {
    key: "roadmap_first",
    name: "Finisher",
    description: "Complete your first roadmap.",
    icon: "Target",
    category: "Progress",
    points: 100,
    rarity: "RARE" as const,
    requirement: "Complete 1 roadmap",
  },
  {
    key: "roadmap_5",
    name: "Sharpshooter",
    description: "Complete 5 roadmaps.",
    icon: "Target",
    category: "Progress",
    points: 300,
    rarity: "EPIC" as const,
    requirement: "Complete 5 roadmaps",
  },
  // Streak category
  {
    key: "streak_3",
    name: "On a Roll",
    description: "Maintain a 3-day learning streak.",
    icon: "Flame",
    category: "Streak",
    points: 20,
    rarity: "COMMON" as const,
    requirement: "3-day streak",
  },
  {
    key: "streak_7",
    name: "On Fire",
    description: "Maintain a 7-day learning streak.",
    icon: "Flame",
    category: "Streak",
    points: 50,
    rarity: "RARE" as const,
    requirement: "7-day streak",
  },
  {
    key: "streak_30",
    name: "Unstoppable",
    description: "Maintain a 30-day learning streak.",
    icon: "Flame",
    category: "Streak",
    points: 200,
    rarity: "LEGENDARY" as const,
    requirement: "30-day streak",
  },
  // Points category
  {
    key: "points_100",
    name: "Rising Star",
    description: "Earn 100 total points.",
    icon: "Star",
    category: "Points",
    points: 30,
    rarity: "COMMON" as const,
    requirement: "Earn 100 points",
  },
  {
    key: "points_500",
    name: "High Achiever",
    description: "Earn 500 total points.",
    icon: "Star",
    category: "Points",
    points: 75,
    rarity: "RARE" as const,
    requirement: "Earn 500 points",
  },
  {
    key: "points_1000",
    name: "Elite Learner",
    description: "Earn 1,000 total points.",
    icon: "Star",
    category: "Points",
    points: 150,
    rarity: "EPIC" as const,
    requirement: "Earn 1,000 points",
  },
  // Community category
  {
    key: "social_first_like",
    name: "Community Member",
    description: "Like your first roadmap.",
    icon: "Users",
    category: "Community",
    points: 5,
    rarity: "COMMON" as const,
    requirement: "Like 1 roadmap",
  },
  {
    key: "bookworm",
    name: "Bookworm",
    description: "Save 10 roadmaps to your library.",
    icon: "BookOpen",
    category: "Community",
    points: 20,
    rarity: "COMMON" as const,
    requirement: "Save 10 roadmaps",
  },
  {
    key: "legend",
    name: "Legend",
    description: "Earn 5,000 total points.",
    icon: "Trophy",
    category: "Progress",
    points: 500,
    rarity: "LEGENDARY" as const,
    requirement: "Earn 5,000 points",
  },
] as const;

// ── Checker ─────────────────────────────────────────────────────────────────

export async function checkAndAwardAchievements(userId: string): Promise<string[]> {
  try {
    // Get user stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        points: true,
        streak: true,
        _count: {
          select: {
            completedNodes: true,
            likes: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!user) return [];

    // Count completed roadmaps (from activities)
    const completedRoadmaps = await prisma.activity.count({
      where: { userId, type: "ROADMAP_COMPLETED" },
    });

    // Get already-unlocked achievement keys
    const unlocked = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: { select: { key: true } } },
    });
    const unlockedKeys = new Set(unlocked.map((u) => u.achievement.key));

    // Find achievements to award
    const toAward: string[] = [];

    for (const def of ACHIEVEMENT_DEFINITIONS) {
      if (unlockedKeys.has(def.key)) continue;

      let earned = false;

      switch (def.key) {
        case "first_step": earned = user._count.completedNodes >= 1; break;
        case "node_5": earned = user._count.completedNodes >= 5; break;
        case "node_25": earned = user._count.completedNodes >= 25; break;
        case "node_100": earned = user._count.completedNodes >= 100; break;
        case "roadmap_first": earned = completedRoadmaps >= 1; break;
        case "roadmap_5": earned = completedRoadmaps >= 5; break;
        case "streak_3": earned = user.streak >= 3; break;
        case "streak_7": earned = user.streak >= 7; break;
        case "streak_30": earned = user.streak >= 30; break;
        case "points_100": earned = user.points >= 100; break;
        case "points_500": earned = user.points >= 500; break;
        case "points_1000": earned = user.points >= 1000; break;
        case "legend": earned = user.points >= 5000; break;
        case "social_first_like": earned = user._count.likes >= 1; break;
        case "bookworm": earned = user._count.bookmarks >= 10; break;
      }

      if (earned) toAward.push(def.key);
    }

    if (toAward.length === 0) return [];

    // Look up Achievement record IDs
    const achievements = await prisma.achievement.findMany({
      where: { key: { in: toAward } },
      select: { id: true, key: true, points: true },
    });

    // Award achievements in a transaction
    await prisma.$transaction(async (tx) => {
      for (const achievement of achievements) {
        await tx.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
          },
        });

        // Award achievement points to user
        await tx.user.update({
          where: { id: userId },
          data: { points: { increment: achievement.points } },
        });

        // Log activity
        await tx.activity.create({
          data: {
            userId,
            type: "ACHIEVEMENT_UNLOCKED",
            metadata: JSON.stringify({ achievementKey: achievement.key }),
          },
        });
      }
    });

    return toAward;
  } catch (error) {
    console.error("[achievements] Error checking achievements:", error);
    return [];
  }
}
