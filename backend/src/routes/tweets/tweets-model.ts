/**
 * Model for creating/reading/updating/deleting stored tweets
 */
import HttpStatus from 'http-status';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { HTTPTweet, Tweet, Tweets } from './tweets';
import prisma from '../../../lib/prisma';
import { ServerError } from '../types';
import { logToFile } from '../../logging/logging';
import { getTwitterUser } from '../twitter-users/twitter-users-model';

export const getTweet = async (tweetId: string): Promise<Tweet | ServerError> => {
	try {
		const result = await prisma.tweet.findUnique({
			where: {
				id: +tweetId,
			},
		});
		if (result) {
			return result;
		}
		return new ServerError(HttpStatus.NOT_FOUND, `Tweet with ID ${tweetId} not found.`);
	} catch (e) {
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to get tweet due to server problem.');
	}
};

export const getTweets = async (twitterUserId: string): Promise<Tweets | ServerError> => {
	const twitterUserExists = await getTwitterUser(twitterUserId);
	if (twitterUserExists instanceof ServerError) {
		return twitterUserExists;
	}

	try {
		return await prisma.tweet.findMany({
			where: {
				twitterUserId: BigInt(twitterUserId),
			},
		});
	} catch (e) {
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to get tweets due to server problem.');
	}
};

export const insertTweet = async (httpTweet: HTTPTweet): Promise<Tweet | ServerError> => {
	const { accountId, twitterUserId, scheduledTimeUTC, content, image } = httpTweet;
	console.log(image);

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

export const updateTweetContent = async (tweetId: string, content: string): Promise<Tweet | ServerError> => {
	try {
		return await prisma.tweet.update({
			where: {
				id: +tweetId,
			},
			data: {
				content,
			},
		});
	} catch (e) {
		if (e instanceof PrismaClientKnownRequestError) {
			return new ServerError(HttpStatus.NOT_FOUND, `Tweet with ID ${tweetId} not found.`);
		}
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to update tweet due to server problem.');
	}
};

export const updateTweetScheduledTime = async (
	tweetId: string,
	scheduledTimeUTC: Date | string,
): Promise<Tweet | ServerError> => {
	try {
		return await prisma.tweet.update({
			where: {
				id: +tweetId,
			},
			data: {
				scheduledTimeUTC,
			},
		});
	} catch (e) {
		if (e instanceof PrismaClientKnownRequestError) {
			return new ServerError(HttpStatus.NOT_FOUND, `Tweet with ID ${tweetId} not found.`);
		}
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to update tweet due to server problem.');
	}
};

export const updateTweetSent = async (tweetId: string, sent: boolean): Promise<Tweet | ServerError> => {
	try {
		return await prisma.tweet.update({
			where: {
				id: +tweetId,
			},
			data: {
				sent,
			},
		});
	} catch (e) {
		if (e instanceof PrismaClientKnownRequestError) {
			return new ServerError(HttpStatus.NOT_FOUND, `Tweet with ID ${tweetId} not found.`);
		}
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to update tweet due to server problem.');
	}
};

export const deleteTweet = async (tweetId: string): Promise<Tweet | ServerError> => {
	try {
		return await prisma.tweet.delete({
			where: {
				id: +tweetId,
			},
		});
	} catch (e) {
		if (e instanceof PrismaClientKnownRequestError) {
			return new ServerError(
				HttpStatus.NOT_FOUND,
				`Tweet with ID ${tweetId} not found: either already deleted or received incorrect/invalid ID.`,
			);
		}
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to delete tweet due to server problem.');
	}
};
