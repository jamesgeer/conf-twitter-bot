/**
 * Model for creating/reading/updating/deleting stored tweets
 */
import HttpStatus from 'http-status';
import { HTTPTweet, Tweet, Tweets } from './tweets';
import prisma from '../../../lib/prisma';
import { ServerError } from '../types';
import { logToFile } from '../../logging/logging';

export const getTweets = async (twitterUserId: string): Promise<Tweets> =>
	prisma.tweet.findMany({
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

export const insertTweet = async (httpTweet: HTTPTweet): Promise<boolean | ServerError> => {
	const { accountId, twitterUserId, scheduledTimeUTC, content } = httpTweet;

	if (!accountId || !twitterUserId || !scheduledTimeUTC || !content) {
		return new ServerError(HttpStatus.UNAUTHORIZED, 'Tweet missing required fields.');
	}

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
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to create account due to server problem.');
	}

	// successfully inserted
	return true;
};

export const updateTweet = async (tweet: Tweet): Promise<Tweet | ServerError> => {
	try {
		return await prisma.tweet.update({
			where: {
				id: tweet.id,
			},
			data: {
				scheduledTimeUTC: tweet.scheduledTimeUTC,
				content: tweet.content,
			},
		});
	} catch (e) {
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to update tweet due to server problem.');
	}
};

export const deleteTweet = async (tweetId: number): Promise<boolean | ServerError> => {
	try {
		prisma.tweet.delete({
			where: {
				id: tweetId,
			},
		});
		return true;
	} catch (e) {
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to delete tweet due to server problem.');
	}
};
