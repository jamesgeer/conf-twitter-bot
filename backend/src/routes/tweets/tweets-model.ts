/**
 * Model for creating/reading/updating/deleting stored tweets
 */
import HttpStatus from 'http-status';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { HTTPTweet, Tweet, Tweets } from './tweets';
import prisma from '../../../lib/prisma';
import { ServerError } from '../types';
import { logToFile } from '../../logging/logging';

export const getTwitterUserTweets = async (twitterUserId: bigint): Promise<Tweets | ServerError> => {
	try {
		return await prisma.tweet.findMany({
			where: {
				twitterUserId,
			},
			orderBy: {
				dateTime: 'desc',
			},
			include: {
				uploads: true,
			},
		});
	} catch (e) {
		console.log(e);
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to get tweets due to server problem.');
	}
};

export const insertTwitterUserTweet = async (
	twitterUserId: bigint,
	httpTweet: HTTPTweet,
): Promise<Tweet | ServerError> => {
	console.log(httpTweet);
	const { accountId, dateTime, content } = httpTweet;

	try {
		return await prisma.tweet.create({
			data: {
				accountId: +accountId,
				twitterUserId,
				dateTime: new Date(dateTime),
				content,
			},
		});
	} catch (e) {
		console.log(e);
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to create account due to server problem.');
	}
};

export const getTweet = async (tweetId: number): Promise<Tweet | ServerError> => {
	try {
		const result = await prisma.tweet.findUnique({
			where: {
				id: tweetId,
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

export const getTweets = async (): Promise<Tweets | ServerError> => {
	try {
		return await prisma.tweet.findMany({
			include: {
				uploads: true,
			},
		});
	} catch (e) {
		console.log(e);
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to get tweets due to server problem.');
	}
};

export const insertTweet = async (httpTweet: HTTPTweet): Promise<Tweet | ServerError> => {
	const { accountId, twitterUserId, dateTime, content } = httpTweet;
	console.log(httpTweet);

	if (!accountId || !twitterUserId || !dateTime || !content) {
		return new ServerError(HttpStatus.UNAUTHORIZED, 'Tweet missing required fields.');
	}

	// temp, need a better check
	if (accountId.length === 0 || twitterUserId.length === 0 || dateTime.length === 0 || content.length === 0) {
		return new ServerError(HttpStatus.UNAUTHORIZED, 'Tweet missing required fields.');
	}

	const isoDate = new Date(dateTime);

	try {
		return await prisma.tweet.create({
			data: {
				accountId: +accountId,
				twitterUserId: BigInt(twitterUserId),
				dateTime: isoDate,
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
	dateTime: Date | string,
): Promise<Tweet | ServerError> => {
	try {
		return await prisma.tweet.update({
			where: {
				id: +tweetId,
			},
			data: {
				dateTime,
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

export const updateTweetSent = async (tweetId: number, sent: boolean): Promise<Tweet | ServerError> => {
	try {
		return await prisma.tweet.update({
			where: {
				id: tweetId,
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
