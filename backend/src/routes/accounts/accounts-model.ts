/**
 * Model for creating/reading/updating/deleting stored Twitter accounts
 */
import HttpStatus from 'http-status';
import prisma from '../../../lib/prisma';
import { Account, Accounts } from './accounts';
import { ServerError } from '../types';

export const getAccounts = async (userId: number): Promise<Accounts> =>
	prisma.account.findMany({
		where: {
			userId,
		},
		select: {
			id: true,
			userId: true,
			twitterUser: {
				select: {
					id: true,
					name: true,
					screenName: true,
					profileImageUrl: true,
				},
			},
		},
	});

export const getAccount = async (accountId: string): Promise<Account> =>
	prisma.account.findUnique({
		where: {
			id: +accountId,
		},
		select: {
			id: true,
			userId: true,
			twitterUser: {
				select: {
					id: true,
					name: true,
					screenName: true,
					profileImageUrl: true,
				},
			},
		},
	});

// check if an account exists for the provided userId and twitterUserId
export const accountExists = async (userId: number, twitterUserId: bigint): Promise<boolean> => {
	const result = await prisma.account.count({
		where: {
			userId: +userId,
			twitterUserId: BigInt(twitterUserId),
		},
	});

	return result > 0;
};

export const insertAccount = async (userId: number, twitterUserId: bigint): Promise<boolean | ServerError> => {
	if (await accountExists(userId, twitterUserId)) {
		return new ServerError(HttpStatus.CONFLICT, 'Account already exists.');
	}

	return true;
};
