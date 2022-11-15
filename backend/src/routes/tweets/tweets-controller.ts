import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import {
	getTweets,
	insertTweet,
	deleteTweet,
	updateTweetScheduledTime,
	updateTweetContent,
	getTweet,
} from './tweets-model';
import { ServerError } from '../types';
import { HTTPTweet, Tweet } from './tweets';
import { handleServerError } from '../util';

export const tweet = async (ctx: ParameterizedContext): Promise<void> => {
	const { id } = ctx.params;
	const result = await getTweet(id);
	if (result instanceof ServerError) {
		handleServerError(ctx, result);
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = result;
};

export const tweets = async (ctx: ParameterizedContext): Promise<void> => {
	if (!ctx.session) {
		ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
		return;
	}

	const result = await getTweets(ctx.session.twitterUserId);
	if (result instanceof ServerError) {
		handleServerError(ctx, result);
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = result;
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
	ctx.body = result.id;
};

export const updateTweet = async (ctx: ParameterizedContext): Promise<void> => {
	const { id } = ctx.params;
	const { scheduledTimeUTC, content } = ctx.request.body;

	if (!scheduledTimeUTC && !content) {
		ctx.status = HttpStatus.BAD_REQUEST;
		return;
	}

	let updatedTweet = {} as Tweet;

	if (scheduledTimeUTC) {
		const result = await updateTweetScheduledTime(id, scheduledTimeUTC);
		if (result instanceof ServerError) {
			handleServerError(ctx, result);
			return;
		}
		updatedTweet = result;
	}

	if (content) {
		const result = await updateTweetContent(id, content);
		if (result instanceof ServerError) {
			handleServerError(ctx, result);
			return;
		}
		updatedTweet = result;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = updatedTweet;
};

export const removeTweet = async (ctx: ParameterizedContext): Promise<void> => {
	const { id } = ctx.params;
	const result = await deleteTweet(id);
	if (result instanceof ServerError) {
		ctx.status = result.getStatusCode();
		ctx.body = { message: result.getMessage() };
		return;
	}

	ctx.status = HttpStatus.OK;
};
