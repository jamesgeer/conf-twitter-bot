import { PrismaClient } from '@prisma/client';

/**
 * PrismaClient is attached to the `global` object in development to prevent
 * exhausting database connection limit.
 * Learn more: https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
 */
interface PrismaGlobal {
	prisma: PrismaClient;
}

declare const global: PrismaGlobal;

const prisma = global.prisma || new PrismaClient();

if (process.env.DEV) {
	global.prisma = prisma;
}

export default prisma;
