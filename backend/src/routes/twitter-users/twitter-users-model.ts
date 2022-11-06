import HttpStatus from 'http-status';
import { TwitterUser } from '../accounts/accounts';
import prisma from '../../../lib/prisma';
import { ServerError } from '../types';
import { TwitterAccount } from '../oauths/oauths';
import { logToFile } from '../../logging/logging';

export const getTwitterUser = async (twitterUserId: string): Promise<TwitterUser | ServerError> => {
	try {
		const result = await prisma.twitterUser.findUnique({
			where: {
				id: BigInt(twitterUserId),
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

export const insertTwitterUser = async (twitterAccount: TwitterAccount): Promise<bigint | ServerError> => {
	const { userId, name, screenName, profileImageUrl } = twitterAccount;
	try {
		const result = await prisma.twitterUser.create({
			data: {
				id: BigInt(userId),
				name,
				screenName,
				profileImageUrl,
			},
		});
		return result.id;
	} catch (e) {
		console.log(e);
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to add Twitter user due to server problem.');
	}
};
