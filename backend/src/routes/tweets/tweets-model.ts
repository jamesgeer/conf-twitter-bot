/**
 * Model for creating/reading/updating/deleting stored tweets
 */
import HttpStatus from 'http-status';
import { HTTPTweet, Tweets } from './tweets';
import prisma from '../../../lib/prisma';
import { ServerError } from '../types';

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

export const insertTweet = async (httpTweet: HTTPTweet): Promise<boolean | ServerError> => {
	const { accountId, twitterUserId, scheduledTimeUTC, content } = httpTweet;

	// temp, need a better check
	if (accountId.length === 0 || twitterUserId.length === 0 || scheduledTimeUTC.length === 0 || content.length === 0) {
		return new ServerError(HttpStatus.UNAUTHORIZED, 'Tweet missing required fields.');
	}

	const isoDate = new Date(scheduledTimeUTC);

	try {
		await prisma.tweet.create({
			data: {
				accountId: +accountId,
				twitterUserId: BigInt(twitterUserId),
				scheduledTimeUTC: isoDate,
				content,
			},
		});
	} catch (e) {
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to create account due to server problem.');
	}

	// successfully inserted
	return true;
};

// export const insertTweet = (httpTweet: HTTPTweet): boolean => {
// 	const { text, userId, scheduledTimeUTC } = httpTweet;
//
// 	// temp, need a better check
// 	if (userId.length === 0 || text.length === 0 || scheduledTimeUTC.length === 0) {
// 		return false;
// 	}
//
// 	// temp, convert httpTweet to regular tweet
// 	const tweet = {
// 		text,
// 		image64: '',
// 		paperId: 0,
// 		userId,
// 		scheduledTimeUTC,
// 	};
//
// 	// temp until a real database is implemented, load data
// 	tweets = getTweets();
// 	// tweets.push(tweet);
//
// 	try {
// 		// writeFileSync(pathToFile, JSON.stringify(tweets));
// 		return true;
// 	} catch (e) {
// 		console.log(e);
// 		return false;
// 	}
// };
