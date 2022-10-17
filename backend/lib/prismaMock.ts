import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line import/no-extraneous-dependencies,node/no-unpublished-import
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

import prisma from './prisma';

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

jest.mock('./client', () => ({
	__esModule: true,
	default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
	mockReset(prismaMock);
});
