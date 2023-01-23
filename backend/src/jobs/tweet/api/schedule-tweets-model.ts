import prisma from '../../../../lib/prisma';

/**
 * Return all scheduled tweets that have not been sent and have a dateTime
 * set to a timestamp before "now". now being the current datetime that this
 * method is run.
 */
export const getScheduledTweets = async (): Promise<any> => {
	const now = new Date();

	return prisma.twitterUser.findMany({
		where: {
			tweets: {
				some: {
					sent: false,
					dateTime: {
						lte: now,
					},
				},
			},
		},
		select: {
			id: true,
			tweets: {
				where: {
					sent: false,
					dateTime: {
						lte: now,
					},
				},
			},
			oauth: true,
		},
	});
};
