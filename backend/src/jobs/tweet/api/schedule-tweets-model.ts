import { Tweet, Tweets } from '../../../routes/tweets/tweets';
import prisma from '../../../../lib/prisma';
import { TwitterUserOAuth } from '../../../routes/oauths/oauths';

interface ScheduleTweet {
	twitterUserOAuth: TwitterUserOAuth;
	tweets: Tweets;
}

type ScheduledTweets = Array<ScheduleTweet>;

export const getScheduledTweets = async (): Promise<any> =>
	prisma.twitterUser.findMany({
		select: {
			id: true,
			tweets: {
				where: {
					sent: false,
					dateTime: {
						lte: new Date(),
					},
				},
			},
			oauth: true,
		},
	});
