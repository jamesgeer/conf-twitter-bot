/**
 * Model for creating/reading/updating/deleting stored Twitter accounts
 */
import HttpStatus from 'http-status';
import prisma from '../../../lib/prisma';
import { Account, Accounts } from './accounts';
import { ServerError } from '../types';
import { logToFile } from '../../logging/logging';

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

export const getAccount = async (accountId: string): Promise<Account | null> =>
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
			userId,
			twitterUserId,
		},
	});

	return result > 0;
};

export const insertAccount = async (userId: number, twitterUserId: bigint): Promise<number | ServerError> => {
	if (await accountExists(userId, twitterUserId)) {
		return new ServerError(HttpStatus.CONFLICT, 'Account already exists.');
	}

	try {
		const result = await prisma.account.create({
			data: {
				userId,
				twitterUserId,
			},
		});
		return result.id;
	} catch (e) {
		console.log(e);
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to create account due to server problem.');
	}
};

// due to foreign key constraints, before removing an account, the relations must first be deleted
export const deleteAccount = async (accountId: string): Promise<boolean | ServerError> => {
	const account = await getAccount(accountId);
	if (account === null) {
		return new ServerError(HttpStatus.NOT_FOUND, 'Account does not exist.');
	}
	try {
		const deleteTwitterAccount = prisma.account.delete({
			where: {
				id: +accountId,
			},
		});

		const deleteTweets = prisma.tweet.deleteMany({
			where: {
				accountId: +accountId,
			},
		});

		const deleteTwitterOAuth = prisma.twitterOAuth.deleteMany({
			where: {
				accountId: +accountId,
			},
		});

		await prisma.$transaction([deleteTwitterOAuth, deleteTweets, deleteTwitterAccount]);
		return true;
	} catch (e) {
		console.log(e);
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to delete account due to server problem.');
	}
};
