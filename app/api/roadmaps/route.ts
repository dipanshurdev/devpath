import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin } from '@/lib/auth-utils';
import { Difficulty, RoadmapType, RoadmapStatus, Prisma } from '@prisma/client';
import { cache, cacheKeys, cacheTTL } from '@/lib/cache';
import { withErrorHandler, ApiError, createApiResponse } from '@/lib/api-handler';
import { logger } from '@/lib/logger';
import { z } from 'zod';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

const roadmapCreateSchema = z.object({
  roadmapId: z.string().min(1, "Roadmap ID is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required"),
  summary: z.string().optional().nullable(),
  type: z.enum(["role", "skill", "project", "language", "tool", "career"] as const),
  category: z.string().optional().nullable(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"] as const),
  estimatedTime: z.string().min(1, "Estimated time is required"),
  prerequisites: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"] as const).optional().default("DRAFT"),
  isOfficial: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(false),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  keywords: z.array(z.string()).optional().default([]),
  order: z.number().optional().default(0),
  priority: z.number().optional().default(0),
  creatorId: z.string().optional().nullable(),
});

type RoadmapListCache = {
  data: Array<Record<string, unknown>>;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
    totalPages: number;
  };
};

// GET /api/roadmaps - Get all roadmaps with pagination
export const GET = withErrorHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') as RoadmapType | null;
  const difficulty = searchParams.get('difficulty') as Difficulty | null;
  const featured = searchParams.get('featured');
  const search = searchParams.get('search');
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const pageSize = Math.min(Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10) || 20), 100);

  // Create cache key based on search parameters
  const cacheKeyParams = new URLSearchParams({
    ...(type && { type }),
    ...(difficulty && { difficulty }),
    ...(featured && { featured }),
    ...(search && { search }),
    page: page.toString(),
    pageSize: pageSize.toString(),
  }).toString();
  
  const cacheKey = cacheKeys.roadmapList(cacheKeyParams);

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  // Try to get cached list data first; userStatus is attached separately when present
  const cached = await cache.get<RoadmapListCache>(cacheKey);
  if (cached && !userId) {
    return createApiResponse({
      data: cached.data,
      pagination: cached.pagination,
      fromCache: true,
    });
  }

  const where: Prisma.RoadmapWhereInput = {
    isPublished: true,
  };

  if (type) where.type = type;
  if (difficulty) where.difficulty = difficulty;
  if (featured === 'true') where.isFeatured = true;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const skip = (page - 1) * pageSize;

  const [roadmaps, total] = await Promise.all([
    prisma.roadmap.findMany({
      where,
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
      orderBy: [
        { isFeatured: 'desc' },
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      skip,
      take: pageSize,
    }),
    prisma.roadmap.count({ where }),
  ]);

  let roadmapsWithStatus = roadmaps;

  if (userId && roadmaps.length > 0) {
    const roadmapIds = roadmaps.map((roadmap) => roadmap.id);
    const [likes, bookmarks] = await Promise.all([
      prisma.roadmapLike.findMany({
        where: {
          userId,
          roadmapId: { in: roadmapIds },
        },
        select: { roadmapId: true },
      }),
      prisma.bookmark.findMany({
        where: {
          userId,
          roadmapId: { in: roadmapIds },
        },
        select: { roadmapId: true },
      }),
    ]);

    const likedRoadmapIds = new Set(likes.map((like) => like.roadmapId));
    const bookmarkedRoadmapIds = new Set(bookmarks.map((bookmark) => bookmark.roadmapId));

    roadmapsWithStatus = roadmaps.map((roadmap) => ({
      ...roadmap,
      isLiked: likedRoadmapIds.has(roadmap.id),
      isBookmarked: bookmarkedRoadmapIds.has(roadmap.id),
    }));
  }

  const hasMore = skip + roadmapsWithStatus.length < total;
  const pagination = {
    page,
    pageSize,
    total,
    hasMore,
    totalPages: Math.ceil(total / pageSize),
  };

  const responseData = { data: roadmapsWithStatus, pagination };

  // Cache the generic response for 60 seconds
  if (!userId) {
    await cache.set(cacheKey, { data: roadmaps, pagination }, { ttl: cacheTTL.MEDIUM });
  }

  return createApiResponse({
    ...responseData,
    fromCache: false,
  });
});

// POST /api/roadmaps - Create new roadmap (Admin only)
export const POST = withErrorHandler(async (request: NextRequest) => {
  const { session, response } = await requireAdmin();
  if (response) return response;

  logger.info({
    route: "/api/roadmaps",
    method: "POST",
    message: "Admin created roadmap",
    adminId: session.user.id,
    adminRole: session.user.role,
  });

  const body = await request.json();
  const validatedData = roadmapCreateSchema.parse(body);

  const { roadmapId, slug } = validatedData;

  // Check if roadmapId or slug already exists
  const existing = await prisma.roadmap.findFirst({
    where: {
      OR: [{ roadmapId }, { slug }],
    },
  });

  if (existing) {
    throw ApiError.conflict('Roadmap with this ID or slug already exists');
  }

  const roadmap = await prisma.roadmap.create({
    data: validatedData,
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
    },
  });

  // Invalidate roadmap list cache
  await cache.invalidate(cacheKeys.roadmapList());

  return createApiResponse(roadmap, 'Roadmap created successfully', 201);
});
