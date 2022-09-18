import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getTweets, insertTweet } from './tweets-model';
import { ServerError } from '../types';
import { HTTPTweet } from './tweets';

export const tweets = async (ctx: ParameterizedContext): Promise<void> => {
	const tweets = await getTweets(ctx.session.userId);

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
	const result = await insertTweet(httpTweet);

	if (result instanceof ServerError) {
		ctx.status = result.getStatusCode();
		ctx.body = { message: result.getMessage() };
		return;
	}

	// success
	ctx.status = HttpStatus.CREATED;
};
