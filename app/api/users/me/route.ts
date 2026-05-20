import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma/client';
import { withErrorHandler, ApiError, createApiResponse, validateRequestBody } from '@/lib/api-handler';
import { cache, cacheKeys } from '@/lib/cache';

// Type for profile update data
interface ProfileUpdateData {
  name?: string;
  bio?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  location?: string;
  company?: string;
  isPublic?: boolean;
  newsletter?: boolean;
}

/**
 * PATCH /api/users/me - Update current user's profile
 */
export const PATCH = withErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw ApiError.unauthorized();
  }

  const body = await request.json();
  const userId = session.user.id;

  // Validate request body
  const { isValid, missingFields } = validateRequestBody<ProfileUpdateData>(body, []);
  if (!isValid) {
    throw ApiError.badRequest(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Check username uniqueness if being updated
  if (body.username && body.username !== session.user.username) {
    const existingUser = await prisma.user.findUnique({
      where: { username: body.username as string },
      select: { id: true },
    });

    if (existingUser) {
      throw ApiError.conflict('Username already taken');
    }
  }

  // Filter out undefined fields and prepare update data
  const updateData: any = {};
  const allowedFields = [
    'name', 'bio', 'github', 'linkedin', 'twitter', 
    'website', 'location', 'company', 'isPublic', 'newsletter'
  ];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  // Add updatedAt
  updateData.updatedAt = new Date();

  // Update user profile
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      bio: true,
      avatar: true,
      github: true,
      linkedin: true,
      twitter: true,
      website: true,
      location: true,
      company: true,
      isPublic: true,
      newsletter: true,
      role: true,
      points: true,
      streak: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Invalidate user profile cache
  await cache.invalidate(cacheKeys.userProfile(updatedUser.username));

  return createApiResponse(updatedUser, 'Profile updated successfully');
});

/**
 * GET /api/users/me - Get current user's profile
 */
export const GET = withErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw ApiError.unauthorized();
  }

  const userId = session.user.id;
  const cacheKey = cacheKeys.userProfile(session.user.username || '');

  // Try to get from cache first
  const cached = await cache.get<any>(cacheKey);
  if (cached) {
    return createApiResponse(cached);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      bio: true,
      avatar: true,
      github: true,
      linkedin: true,
      twitter: true,
      website: true,
      location: true,
      company: true,
      isPublic: true,
      newsletter: true,
      role: true,
      points: true,
      streak: true,
      createdAt: true,
      updatedAt: true,
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

  const profileData = {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    bio: user.bio,
    avatar: user.avatar,
    github: user.github,
    linkedin: user.linkedin,
    twitter: user.twitter,
    website: user.website,
    location: user.location,
    company: user.company,
    isPublic: user.isPublic,
    newsletter: user.newsletter,
    role: user.role,
    points: user.points,
    streak: user.streak,
    joinedAt: user.createdAt,
    updatedAt: user.updatedAt,
    stats: {
      roadmapsCreated: user.customRoadmaps.length,
      likes: user.likes.length,
      bookmarks: user.bookmarks.length,
      nodesCompletedLast30Days: user.completedNodes.length,
    },
  };

  // Cache the profile data for 5 minutes
  await cache.set(cacheKey, profileData, { ttl: 300 });

  return createApiResponse(profileData);
});
