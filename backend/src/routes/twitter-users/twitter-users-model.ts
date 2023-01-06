import HttpStatus from 'http-status';
import { TwitterUser } from '../accounts/accounts';
import prisma from '../../../lib/prisma';
import { ServerError } from '../types';
import { logToFile } from '../../logging/logging';
import { accountExists } from '../accounts/accounts-model';

/**
 * returns true if the Twitter user exists, false otherwise
 * @param twitterUserId
 */
export const twitterUserExists = async (twitterUserId: bigint): Promise<boolean> => {
	const result = await prisma.twitterUser.count({
		where: {
			id: twitterUserId,
		},
	});
	return result > 0;
};

export const getTwitterUser = async (twitterUserId: bigint): Promise<TwitterUser | ServerError> => {
	try {
		const result = await prisma.twitterUser.findUnique({
			where: {
				id: twitterUserId,
			},
		});
		if (result) {
			return result;
		}
		return new ServerError(HttpStatus.NOT_FOUND, `Twitter user with ID ${twitterUserId} not found.`);
	} catch (e) {
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to get tweet due to server problem.');
	}
};

export const insertTwitterUser = async (
	userId: number,
	twitterUser: TwitterUser,
): Promise<TwitterUser | ServerError> => {
	// user is attempting to add a Twitter account that they already control
	if (await accountExists(userId, twitterUser.id)) {
		console.log('conflict');
		return new ServerError(HttpStatus.CONFLICT, 'You already have access to this Twitter user.');
	}

	// another user is trying to add an existing account so just use existing value
	if (await twitterUserExists(twitterUser.id)) {
		console.log('exists');
		return twitterUser;
	}

	console.log('new');
	const { id, name, screenName, profileImageUrl } = twitterUser;
	try {
		return await prisma.twitterUser.create({
			data: {
				id,
				name,
				screenName,
				profileImageUrl,
			},
		});
	} catch (e) {
		console.log(e);
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to add Twitter user due to server problem.');
	}
};
