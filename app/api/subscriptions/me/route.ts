import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { withErrorHandler, ApiError, createApiResponse } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth-utils';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

/**
 * GET /api/subscriptions/me - Get current user's subscription
 */
export const GET = withErrorHandler(async (_request: NextRequest) => {
  const { session, response } = await requireAuth();
  if (response) return response;

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
