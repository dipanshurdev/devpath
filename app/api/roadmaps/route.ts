import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin } from '@/lib/auth-utils';
import { Difficulty, RoadmapType, RoadmapStatus, Prisma } from '@prisma/client';
import { cache, cacheKeys, cacheTTL } from '@/lib/cache';
import { withErrorHandler, ApiError, createApiResponse } from '@/lib/api-handler';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

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
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();

  const {
    roadmapId,
    slug,
    title,
    description,
    summary,
    type,
    category,
    difficulty,
    estimatedTime,
    prerequisites = [],
    tags = [],
    icon,
    color,
    coverImage,
    videoUrl,
    status = 'DRAFT',
    isOfficial = true,
    isFeatured = false,
    isPublished = false,
    seoTitle,
    seoDescription,
    keywords = [],
    order = 0,
    priority = 0,
    creatorId,
  } = body;

  // Validate required fields
  if (!roadmapId || !slug || !title || !description || !type || !difficulty || !estimatedTime) {
    throw ApiError.badRequest('Missing required fields: roadmapId, slug, title, description, type, difficulty, estimatedTime');
  }

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
    data: {
      roadmapId,
      slug,
      title,
      description,
      summary,
      type: type as RoadmapType,
      category,
      difficulty: difficulty as Difficulty,
      estimatedTime,
      prerequisites,
      tags,
      icon,
      color,
      coverImage,
      videoUrl,
      status: status as RoadmapStatus,
      isOfficial,
      isFeatured,
      isPublished,
      seoTitle,
      seoDescription,
      keywords,
      order,
      priority,
      creatorId,
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
    },
  });

  // Invalidate roadmap list cache
  await cache.invalidate(cacheKeys.roadmapList());

  return createApiResponse(roadmap, 'Roadmap created successfully', 201);
});
