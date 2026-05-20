import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma/client';
import { withErrorHandler, ApiError, createApiResponse } from '@/lib/api-handler';

/**
 * GET /api/subscriptions/me - Get current user's subscription
 */
export const GET = withErrorHandler(async (_request: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw ApiError.unauthorized();
  }

  const userId = session.user.id;

  // Get user's subscription
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: {
      id: true,
      userId: true,
      tier: true,
      status: true,
      currentPeriodStart: true,
      currentPeriodEnd: true,
      externalId: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!subscription) {
    throw ApiError.notFound('Subscription not found');
  }

  return createApiResponse(subscription);
});
