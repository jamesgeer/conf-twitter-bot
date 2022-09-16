/**
 * Model for creating/reading/updating/deleting stored tweets
 */
import { HTTPTweet, Tweets } from './tweets';
import prisma from '../../../lib/prisma';

let tweets: Tweets;

export const getTweets = (): Tweets =>
	// try {
	// 	const fileContent = readFileSync(pathToFile).toString();
	// 	tweets = <Tweets>JSON.parse(fileContent);
	// } catch (e) {
	// 	console.error(e);
	// 	tweets = [];
	// }
	tweets;

export const getAllTweets = async (twitterUserId: string): Promise<void> => {
	const result = prisma.tweet.findMany({
		where: {
			twitterUserId: BigInt(twitterUserId),
		},
		select: {
			id: true,
			twitterUserId: true,
			scheduledTimeUTC: true,
			content: true,
			sent: true,
		},
	});
	console.log(result);
};

export const insertTweet = (httpTweet: HTTPTweet): boolean => {
	const { text, userId, scheduledTimeUTC } = httpTweet;

	// temp, need a better check
	if (userId.length === 0 || text.length === 0 || scheduledTimeUTC.length === 0) {
		return false;
	}

	// temp, convert httpTweet to regular tweet
	const tweet = {
		text,
		image64: '',
		paperId: 0,
		userId,
		scheduledTimeUTC,
	};

	// temp until a real database is implemented, load data
	tweets = getTweets();
	// tweets.push(tweet);

	try {
		// writeFileSync(pathToFile, JSON.stringify(tweets));
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};
