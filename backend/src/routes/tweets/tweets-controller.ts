import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import {
	getTweets,
	insertTweet,
	deleteTweet,
	updateTweetScheduledTime,
	updateTweetContent,
	getTweet,
	getTwitterUserTweets,
	insertTwitterUserTweet,
} from './tweets-model';
import { ServerError } from '../types';
import { HTTPTweet, Tweet } from './tweets';
import { handleServerError } from '../util';

export const twitterUserTweets = async (ctx: ParameterizedContext): Promise<void> => {
	const { id }: { id: string } = ctx.params;
	const twitterUserId = BigInt(id);

	const result = await getTwitterUserTweets(twitterUserId);
	if (result instanceof ServerError) {
		handleServerError(ctx, result);
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = result;
};

export const createTwitterUserTweet = async (ctx: ParameterizedContext): Promise<void> => {
	const { id }: { id: string } = ctx.params;
	const twitterUserId = BigInt(id);
	const httpTweet: HTTPTweet = ctx.request.body;

	const result = await insertTwitterUserTweet(twitterUserId, httpTweet);
	if (result instanceof ServerError) {
		ctx.status = result.getStatusCode();
		ctx.body = { message: result.getMessage() };
		return;
	}

	// success
	ctx.status = HttpStatus.CREATED;
	ctx.body = result;
};

export const tweet = async (ctx: ParameterizedContext): Promise<void> => {
	const { id }: { id: string } = ctx.params;
	const tweetId = +id;

	const result = await getTweet(tweetId);
	if (result instanceof ServerError) {
		handleServerError(ctx, result);
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = result;
};

export const tweets = async (ctx: ParameterizedContext): Promise<void> => {
	const result = await getTweets();
	if (result instanceof ServerError) {
		handleServerError(ctx, result);
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = result;
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
	ctx.body = result;
};

export const updateTweet = async (ctx: ParameterizedContext): Promise<void> => {
	const { id } = ctx.params;
	const { dateTime, content } = ctx.request.body;

	if (!dateTime && !content) {
		ctx.status = HttpStatus.BAD_REQUEST;
		return;
	}

	let updatedTweet = {} as Tweet;

	if (dateTime) {
		const result = await updateTweetScheduledTime(id, dateTime);
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
