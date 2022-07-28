import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getTweets, insertTweet } from '../models/tweets-model';
import { HTTPTweet } from '../types/twitter-types';

export const tweets = async (ctx: ParameterizedContext): Promise<void> => {
	const tweets = getTweets();

	ctx.status = HttpStatus.OK;
	ctx.body = tweets;
};

export const scheduledTweets = async (ctx: ParameterizedContext): Promise<void> => {
	ctx.status = HttpStatus.OK;
	ctx.body = { message: 'Not implemented.' };
};

export const sentTweets = async (ctx: ParameterizedContext): Promise<void> => {
	ctx.status = HttpStatus.OK;
	ctx.body = { message: 'Not implemented.' };
};

export const createTweet = async (ctx: ParameterizedContext): Promise<void> => {
	const httpTweet: HTTPTweet = ctx.request.body;

	// failed to insert tweet
	if (!insertTweet(httpTweet)) {
		ctx.status = HttpStatus.UNAUTHORIZED;
		return;
	}

	// success
	ctx.status = HttpStatus.CREATED;
};
