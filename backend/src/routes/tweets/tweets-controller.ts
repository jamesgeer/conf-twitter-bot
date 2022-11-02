import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getTweets, insertTweet, deleteTweet, updateTweetScheduledTime, updateTweetContent } from './tweets-model';
import { ServerError } from '../types';
import { HTTPTweet, Tweet } from './tweets';
import { handleServerError } from '../util';

export const tweets = async (ctx: ParameterizedContext): Promise<void> => {
	if (!ctx.session) {
		ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
		return;
	}
	const tweets = await getTweets(ctx.session.twitterUserId);

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

export const removeTweet = async (ctx: ParameterizedContext): Promise<void> => {
	if (!ctx.session) {
		ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
		return;
	}

	const { id } = ctx.params;
	const result = await deleteTweet(id);
	if (result instanceof ServerError) {
		ctx.status = result.getStatusCode();
		ctx.body = { message: result.getMessage() };
		return;
	}

	ctx.status = HttpStatus.OK;
};

export const updateTweet = async (ctx: ParameterizedContext): Promise<void> => {
	const { id } = ctx.params;
	const { scheduledTimeUTC, content } = ctx.request.body;

	if (!scheduledTimeUTC || !content) {
		ctx.status = HttpStatus.BAD_REQUEST;
		return;
	}

	let updatedTweet = {} as Tweet;

	if (scheduledTimeUTC) {
		const result = await updateTweetScheduledTime(id, scheduledTimeUTC);
		// eslint-disable-next-line consistent-return
		if (result instanceof ServerError) return handleServerError(ctx, result);
		updatedTweet = result;
	}

	if (content) {
		const result = await updateTweetContent(id, content);
		// eslint-disable-next-line consistent-return
		if (result instanceof ServerError) return handleServerError(ctx, result);
		updatedTweet = result;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = updatedTweet;
};
