/**
 * Model for creating/reading/updating/deleting stored tweets
 */
import HttpStatus from 'http-status';
import { HTTPTweet, Tweet, Tweets } from './tweets';
import prisma from '../../../lib/prisma';
import { ServerError } from '../types';
import { logToFile } from '../../logging/logging';

export const getTweet = async (tweetId: string): Promise<Tweet | null> =>
	prisma.tweet.findUnique({
		where: {
			id: +tweetId,
		},
	});

export const getTweets = async (twitterUserId: string): Promise<Tweets> =>
	prisma.tweet.findMany({
		where: {
			twitterUserId: BigInt(twitterUserId),
		},
	});

export const insertTweet = async (httpTweet: HTTPTweet): Promise<Tweet | ServerError> => {
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
		return await prisma.tweet.create({
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
};

export const updateTweetContent = async (tweetId: string, content: string): Promise<Tweet | ServerError> =>
	prisma.tweet.update({
		where: {
			id: +tweetId,
		},
		data: {
			content,
		},
	});

export const updateTweetScheduledTime = async (
	tweetId: string,
	scheduledTimeUTC: Date | string,
): Promise<Tweet | ServerError> =>
	prisma.tweet.update({
		where: {
			id: +tweetId,
		},
		data: {
			scheduledTimeUTC,
		},
	});

export const updateTweetSent = async (tweetId: number, sent: boolean): Promise<Tweet | ServerError> =>
	prisma.tweet.update({
		where: {
			id: tweetId,
		},
		data: {
			sent,
		},
	});

export const deleteTweet = async (tweetId: string): Promise<boolean | ServerError> => {
	try {
		await prisma.tweet.delete({
			where: {
				id: +tweetId,
			},
		});
		return true;
	} catch (e) {
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to delete tweet due to server problem.');
	}
};
