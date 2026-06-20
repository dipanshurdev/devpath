/**
 * Prisma Client Instance
 *
 * This file creates and exports a singleton Prisma Client instance
 * to prevent multiple instances in development (hot reload)
 */

import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';

// PrismaClient is attached to the `global` object in development
// to prevent exhausting database connections due to hot reloading
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prismaLogs: Prisma.LogLevel[] =
  process.env.NODE_ENV === 'development'
    ? process.env.PRISMA_LOG_QUERIES === 'true'
      ? ['query', 'error', 'warn']
      : ['warn', 'error']
    : ['error'];

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: prismaLogs,
  });

globalForPrisma.prisma = prisma;

export default prisma;
