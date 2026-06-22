import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma/client';
import { withErrorHandler, ApiError, createApiResponse } from '@/lib/api-handler';
import { cache, cacheKeys } from '@/lib/cache';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

/**
 * POST /api/users/me/avatar - Upload user avatar (Not Implemented)
 */
export const POST = withErrorHandler(async (request: NextRequest) => {
  const { session, response } = await requireAuth();
  if (response) return response;

  throw new ApiError('Avatar upload is not implemented yet', 501, 'NOT_IMPLEMENTED');
});

/**
 * DELETE /api/users/me/avatar - Remove user avatar
 */
export const DELETE = withErrorHandler(async (request: NextRequest) => {
  const { session, response } = await requireAuth();
  if (response) return response;

  const userId = session.user.id;

  // Update user's avatar to null
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { avatar: null },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      avatar: true,
      updatedAt: true,
    },
  });

  // Invalidate user profile cache
  if (updatedUser.username) {
    await cache.invalidate(cacheKeys.userProfile(updatedUser.username));
  }

  return createApiResponse(
    { 
      avatarUrl: null,
      message: 'Avatar removed successfully' 
    },
    'Avatar removed successfully'
  );
});
