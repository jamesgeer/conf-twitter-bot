import HttpStatus from 'http-status';
import { TwitterUser } from '../accounts/accounts';
import prisma from '../../../lib/prisma';
import { ServerError } from '../types';
import { TwitterAccount } from '../oauths/oauths';

export const getTwitterUser = async (twitterUserId: string): Promise<TwitterUser> =>
	prisma.twitterUser.findUnique({
		where: {
			id: BigInt(twitterUserId),
		},
	});

export const insertTwitterUser = async (twitterAccount: TwitterAccount): Promise<boolean | ServerError> => {
	const { userId, name, screenName, profileImageUrl } = twitterAccount;
	try {
		await prisma.twitterUser.create({
			data: {
				id: BigInt(userId),
				name,
				screenName,
				profileImageUrl,
			},
		});
	} catch (e) {
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to add Twitter user due to server problem.');
	}

	return true;
};
