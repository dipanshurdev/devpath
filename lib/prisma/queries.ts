/**
 * Prisma Database Queries
 *
 * This file contains all database queries using Prisma Client
 * These replace the Appwrite API functions
 */

import { prisma } from "./client";
import { Prisma } from "@prisma/client";

// ============================================
// USER QUERIES
// ============================================

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      createdRoadmaps: true,
      likedRoadmaps: {
        include: {
          roadmap: true,
        },
      },
      bookmarks: {
        include: {
          roadmap: true,
        },
      },
    },
  });
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Get user by username
 */
export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: { username },
  });
}

/**
 * Create new user
 */
export async function createUser(data: {
  email: string;
  username: string;
  name: string;
  password: string;
  avatar?: string;
}) {
  return await prisma.user.create({
    data,
  });
}

/**
 * Update user
 */
export async function updateUser(userId: string, data: Prisma.UserUpdateInput) {
  return await prisma.user.update({
    where: { id: userId },
    data,
  });
}

// ============================================
// ROADMAP QUERIES
// ============================================

/**
 * Get all roadmaps with pagination
 */
export async function getRoadmaps(options?: {
  skip?: number;
  take?: number;
  type?: string;
  difficulty?: string;
  search?: string;
}) {
  const { skip = 0, take = 20, type, difficulty, search } = options || {};

  const where: Prisma.RoadmapWhereInput = {
    ...(type && { type: type as any }),
    ...(difficulty && { difficulty: difficulty as any }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [roadmaps, total] = await Promise.all([
    prisma.roadmap.findMany({
      where,
      skip,
      take,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            nodes: true,
            likes: true,
            bookmarks: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.roadmap.count({ where }),
  ]);

  return {
    roadmaps,
    total,
    hasMore: skip + take < total,
  };
}

/**
 * Get roadmap by ID with all related data
 */
export async function getRoadmapById(roadmapId: string) {
  return await prisma.roadmap.findUnique({
    where: { roadmapId },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
      nodes: {
        include: {
          resources: true,
          relatedFrom: {
            include: {
              toNode: true,
            },
          },
          relatedTo: {
            include: {
              fromNode: true,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
      likes: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
        },
      },
      bookmarks: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      },
      _count: {
        select: {
          nodes: true,
          likes: true,
          bookmarks: true,
          comments: true,
        },
      },
    },
  });
}

/**
 * Create new roadmap
 */
export async function createRoadmap(data: Prisma.RoadmapCreateInput) {
  return await prisma.roadmap.create({
    data,
    include: {
      creator: true,
    },
  });
}

/**
 * Update roadmap
 */
export async function updateRoadmap(
  roadmapId: string,
  data: Prisma.RoadmapUpdateInput,
) {
  return await prisma.roadmap.update({
    where: { roadmapId },
    data,
  });
}

/**
 * Delete roadmap
 */
export async function deleteRoadmap(roadmapId: string) {
  return await prisma.roadmap.delete({
    where: { roadmapId },
  });
}

// ============================================
// LIKE QUERIES
// ============================================

/** Resolve roadmapId string (slug) to Roadmap internal id */
async function getRoadmapInternalId(roadmapIdStr: string): Promise<string> {
  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmapId: roadmapIdStr },
    select: { id: true },
  });
  if (!roadmap) throw new Error("Roadmap not found");
  return roadmap.id;
}

/**
 * Like a roadmap
 */
export async function likeRoadmap(userId: string, roadmapIdStr: string) {
  const roadmapId = await getRoadmapInternalId(roadmapIdStr);
  return await prisma.roadmapLike.create({
    data: {
      userId,
      roadmapId,
    },
  });
}

/**
 * Unlike a roadmap
 */
export async function unlikeRoadmap(userId: string, roadmapIdStr: string) {
  const roadmapId = await getRoadmapInternalId(roadmapIdStr);
  return await prisma.roadmapLike.delete({
    where: {
      userId_roadmapId: {
        userId,
        roadmapId,
      },
    },
  });
}

/**
 * Check if user liked roadmap
 */
export async function hasUserLikedRoadmap(
  userId: string,
  roadmapIdStr: string,
) {
  const roadmapId = await getRoadmapInternalId(roadmapIdStr);
  const like = await prisma.roadmapLike.findUnique({
    where: {
      userId_roadmapId: {
        userId,
        roadmapId,
      },
    },
  });
  return !!like;
}

// ============================================
// SAVED ROADMAP QUERIES
// ============================================

/**
 * Save a roadmap (bookmark)
 */
export async function saveRoadmap(userId: string, roadmapIdStr: string) {
  const roadmapId = await getRoadmapInternalId(roadmapIdStr);
  return await prisma.bookmark.create({
    data: {
      userId,
      roadmapId,
    },
  });
}

/**
 * Unsave a roadmap (remove bookmark)
 */
export async function unsaveRoadmap(userId: string, roadmapIdStr: string) {
  const roadmapId = await getRoadmapInternalId(roadmapIdStr);
  return await prisma.bookmark.delete({
    where: {
      userId_roadmapId: {
        userId,
        roadmapId,
      },
    },
  });
}

/**
 * Get user's saved roadmaps (bookmarks)
 */
export async function getUserSavedRoadmaps(userId: string) {
  return await prisma.bookmark.findMany({
    where: { userId },
    include: {
      roadmap: {
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              nodes: true,
              likes: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// ============================================
// PROGRESS QUERIES
// ============================================

/**
 * Get user progress for a roadmap (by roadmapId string - we need roadmap internal id)
 */
export async function getUserProgress(userId: string, roadmapIdStr: string) {
  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmapId: roadmapIdStr },
    select: { id: true },
  });
  if (!roadmap) return [];
  return await prisma.progress.findMany({
    where: {
      userId,
      roadmapId: roadmap.id,
    },
    include: {
      node: true,
      resource: true,
    },
  });
}

/**
 * Update progress (node completion). roadmapIdStr is the roadmap slug; nodeId is Node.id (internal).
 */
export async function updateProgress(data: {
  userId: string;
  roadmapIdStr: string;
  nodeId: string;
  resourceId?: string | null;
  isCompleted: boolean;
}) {
  const { userId, roadmapIdStr, nodeId, resourceId, isCompleted } = data;
  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmapId: roadmapIdStr },
    select: { id: true },
  });
  if (!roadmap) throw new Error("Roadmap not found");
  const roadmapId = roadmap.id;
  const status = isCompleted ? "COMPLETED" : ("NOT_STARTED" as const);
  const percentage = isCompleted ? 100 : 0;
  const completedAt = isCompleted ? new Date() : null;
  const resourceIdVal = resourceId ?? null;
  if (resourceIdVal === null) {
    throw new Error(
      "resourceId required for resource-level progress; use setNodeCompleted for node-level",
    );
  }
  return await prisma.progress.upsert({
    where: {
      userId_roadmapId_nodeId_resourceId: {
        userId,
        roadmapId,
        nodeId,
        resourceId: resourceIdVal,
      },
    },
    update: {
      status,
      percentage,
      completedAt,
      updatedAt: new Date(),
    },
    create: {
      userId,
      roadmapId,
      nodeId,
      resourceId: resourceIdVal,
      status,
      percentage,
      completedAt,
    },
  });
}

/** Node-level completion uses CompletedNode (one row per user per node). */
const NODE_ONLY_PLACEHOLDER = "000000000000000000000000";

/** Mark a node as completed or not (node-level, no resource). Uses Progress with placeholder resourceId. */
export async function setNodeCompleted(
  userId: string,
  roadmapIdStr: string,
  nodeId: string,
  completed: boolean,
) {
  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmapId: roadmapIdStr },
    select: { id: true },
  });
  if (!roadmap) throw new Error("Roadmap not found");
  const roadmapId = roadmap.id;
  if (completed) {
    return await prisma.progress.upsert({
      where: {
        userId_roadmapId_nodeId_resourceId: {
          userId,
          roadmapId,
          nodeId,
          resourceId: NODE_ONLY_PLACEHOLDER,
        },
      },
      update: {
        status: "COMPLETED",
        percentage: 100,
        completedAt: new Date(),
        updatedAt: new Date(),
      },
      create: {
        userId,
        roadmapId,
        nodeId,
        resourceId: NODE_ONLY_PLACEHOLDER,
        status: "COMPLETED",
        percentage: 100,
        completedAt: new Date(),
      },
    });
  }
  await prisma.progress.deleteMany({
    where: {
      userId,
      roadmapId,
      nodeId,
      resourceId: NODE_ONLY_PLACEHOLDER,
    },
  });
  return null;
}

/** Get completed node IDs (internal ids) for a user on a roadmap. */
export async function getCompletedNodeIdsForRoadmap(
  userId: string,
  roadmapIdStr: string,
): Promise<string[]> {
  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmapId: roadmapIdStr },
    select: { id: true },
  });
  if (!roadmap) return [];
  const progressList = await prisma.progress.findMany({
    where: {
      userId,
      roadmapId: roadmap.id,
      status: "COMPLETED",
      resourceId: NODE_ONLY_PLACEHOLDER,
    },
    select: { nodeId: true },
  });
  return progressList.map((p) => p.nodeId);
}

/**
 * Get user's overall progress statistics
 */
export async function getUserProgressStats(userId: string) {
  const [totalProgress, completedProgress, roadmapsInProgress] =
    await Promise.all([
      prisma.progress.count({
        where: { userId },
      }),
      prisma.progress.count({
        where: {
          userId,
          status: "COMPLETED",
        },
      }),
      prisma.progress.groupBy({
        by: ["roadmapId"],
        where: { userId },
        _count: true,
      }),
    ]);

  return {
    totalProgress,
    completedProgress,
    completionRate:
      totalProgress > 0 ? (completedProgress / totalProgress) * 100 : 0,
    roadmapsInProgress: roadmapsInProgress.length,
  };
}

/**
 * Get dashboard data for a user: stats, in-progress roadmaps, saved, user info
 */
export async function getDashboardData(userId: string) {
  const [user, stats, bookmarks, progressByRoadmap] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        avatar: true,
        streak: true,
        points: true,
        lastActive: true,
      },
    }),
    getUserProgressStats(userId),
    getUserSavedRoadmaps(userId),
    prisma.progress.groupBy({
      by: ["roadmapId"],
      where: {
        userId,
        resourceId: NODE_ONLY_PLACEHOLDER,
      },
      _count: true,
    }),
  ]);

  if (!user) return null;

  const roadmapIds = progressByRoadmap.map((p) => p.roadmapId);
  const roadmapsWithProgress = roadmapIds.length
    ? await prisma.roadmap.findMany({
        where: { id: { in: roadmapIds } },
        include: {
          _count: { select: { nodes: true } },
        },
      })
    : [];

  const completedPerRoadmap = await Promise.all(
    roadmapIds.map(async (rid) => {
      const count = await prisma.progress.count({
        where: {
          userId,
          roadmapId: rid,
          status: "COMPLETED",
          resourceId: NODE_ONLY_PLACEHOLDER,
        },
      });
      return { roadmapId: rid, completed: count };
    }),
  );

  const inProgress = roadmapsWithProgress.map((r) => {
    const completed =
      completedPerRoadmap.find((c) => c.roadmapId === r.id)?.completed ?? 0;
    const total = r._count.nodes;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      ...r,
      roadmapId: r.roadmapId,
      slug: r.slug,
      title: r.title,
      description: r.description,
      progress: percentage,
      completedNodes: completed,
      totalNodes: total,
    };
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      streak: user.streak,
      points: user.points,
      lastActive: user.lastActive,
    },
    stats: {
      ...stats,
      savedCount: bookmarks.length,
    },
    inProgress,
    saved: bookmarks.map((b) => ({
      ...b.roadmap,
      savedAt: b.createdAt,
    })),
  };
}

// ============================================
// NODE QUERIES
// ============================================

/**
 * Get node by ID
 */
export async function getNodeById(nodeId: string) {
  return await prisma.node.findUnique({
    where: { nodeId },
    include: {
      resources: true,
      roadmap: true,
    },
  });
}

/**
 * Get nodes for a roadmap
 */
export async function getNodesForRoadmap(roadmapId: string) {
  return await prisma.node.findMany({
    where: { roadmap: { roadmapId } },
    include: {
      resources: true,
    },
    orderBy: {
      order: "asc",
    },
  });
}

// ============================================
// SEARCH QUERIES
// ============================================

/**
 * Search roadmaps
 */
export async function searchRoadmaps(
  query: string,
  options?: {
    skip?: number;
    take?: number;
  },
) {
  const { skip = 0, take = 20 } = options || {};

  return await prisma.roadmap.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          nodes: true,
          likes: true,
          bookmarks: true,
        },
      },
    },
    skip,
    take,
    orderBy: {
      viewCount: "desc",
    },
  });
}

// ============================================
// ANALYTICS QUERIES
// ============================================

/**
 * Increment roadmap view count
 */
export async function incrementRoadmapViews(roadmapId: string) {
  return await prisma.roadmap.update({
    where: { roadmapId },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });
}

/**
 * Get trending roadmaps
 */
export async function getTrendingRoadmaps(limit: number = 10) {
  return await prisma.roadmap.findMany({
    take: limit,
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          nodes: true,
          likes: true,
          bookmarks: true,
        },
      },
    },
    orderBy: [{ viewCount: "desc" }, { likes: { _count: "desc" } }],
  });
}
