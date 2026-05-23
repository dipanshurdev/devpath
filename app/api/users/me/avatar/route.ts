import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma/client';
import { withErrorHandler, ApiError, createApiResponse } from '@/lib/api-handler';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;
import { cache, cacheKeys } from '@/lib/cache';

/**
 * POST /api/users/me/avatar - Upload user avatar
 */
export const POST = withErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw ApiError.unauthorized();
  }

  const userId = session.user.id;

  try {
    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      throw ApiError.badRequest('No avatar file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw ApiError.badRequest('Invalid file type. Only JPEG, PNG, and WebP are allowed');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw ApiError.badRequest('File too large. Maximum size is 5MB');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop() ?? 'jpg';
    const filename = `avatars/${userId}_${timestamp}_${randomString}.${fileExtension}`;

    // NOTE: In production replace this with actual cloud storage (S3, Cloudinary, etc.)
    // For now we store a placeholder URL — wire up real upload when storage is configured.
    const avatarUrl = `https://cdn.example.com/${filename}`;

    // Update user's avatar URL in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
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
        avatarUrl: updatedUser.avatar,
        message: 'Avatar uploaded successfully' 
      },
      'Avatar updated successfully'
    );

  } catch (error: unknown) {
    // Handle FormData parsing errors
    if (error instanceof Error && error.message?.includes('FormData parsing failed')) {
      throw ApiError.badRequest('Invalid form data');
    }
    throw error;
  }
});

/**
 * DELETE /api/users/me/avatar - Remove user avatar
 */
export const DELETE = withErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw ApiError.unauthorized();
  }

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
