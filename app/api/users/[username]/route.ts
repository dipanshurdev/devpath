import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma/client';
import { withErrorHandler, ApiError, createApiResponse } from '@/lib/api-handler';
import { cache, cacheKeys, cacheTTL } from '@/lib/cache';

/**
 * GET /api/users/[username] - Get public user profile
 */
export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { username: string } }
) => {
  const username = params.username;
  if (!username) {
    throw ApiError.badRequest('Username is required');
  }

  const cacheKey = cacheKeys.userProfile(username);
  
  // Try to get from cache first
  const cached = await cache.get<any>(cacheKey);
  if (cached) {
    return createApiResponse(cached, undefined, 200);
  }

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      name: true,
      bio: true,
      avatar: true,
      github: true,
      linkedin: true,
      twitter: true,
      website: true,
      location: true,
      company: true,
      isPublic: true,
      role: true,
      points: true,
      streak: true,
      createdAt: true,
      customRoadmaps: {
        select: { id: true },
      },
      likes: {
        select: { id: true },
      },
      bookmarks: {
        select: { id: true },
      },
      completedNodes: {
        where: {
          completedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        select: { id: true },
      },
    },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Check if profile is private and requester is not admin or the user themselves
  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.id === user.id;
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';

  if (!user.isPublic && !isOwner && !isAdmin) {
    throw ApiError.forbidden('This profile is private');
  }

  // Transform the response data
  const profileData = {
    id: user.id,
    username: user.username,
    name: user.name,
    bio: user.bio,
    avatar: user.avatar,
    github: user.github,
    linkedin: user.linkedin,
    twitter: user.twitter,
    website: user.website,
    location: user.location,
    company: user.company,
    role: user.role,
    points: user.points,
    streak: user.streak,
    joinedAt: user.createdAt,
    stats: {
      roadmapsCreated: user.customRoadmaps.length,
      likes: user.likes.length,
      bookmarks: user.bookmarks.length,
      nodesCompletedLast30Days: user.completedNodes.length,
    },
  };

  // Cache the profile data for 5 minutes
  await cache.set(cacheKey, profileData, { ttl: cacheTTL.MEDIUM });

  return createApiResponse(profileData);
});
