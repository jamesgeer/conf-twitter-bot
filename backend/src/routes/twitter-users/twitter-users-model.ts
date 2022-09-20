import { TwitterUser } from '../accounts/accounts';
import prisma from '../../../lib/prisma';

export const getTwitterUser = async (twitterUserId: string): Promise<TwitterUser> =>
	prisma.twitterUser.findUnique({
		where: {
			id: BigInt(twitterUserId),
		},
	});
