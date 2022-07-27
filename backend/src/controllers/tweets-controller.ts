import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';

export const getTweets = async (ctx: ParameterizedContext): Promise<void> => {
	ctx.status = HttpStatus.OK;
	ctx.body = { message: 'Not implemented.' };
};

export const getScheduledTweets = async (ctx: ParameterizedContext): Promise<void> => {
	ctx.status = HttpStatus.OK;
	ctx.body = { message: 'Not implemented.' };
};

export const getSentTweets = async (ctx: ParameterizedContext): Promise<void> => {
	ctx.status = HttpStatus.OK;
	ctx.body = { message: 'Not implemented.' };
};

export const postTweet = async (ctx: ParameterizedContext): Promise<void> => {
	ctx.status = HttpStatus.OK;
	ctx.body = { message: 'Not implemented.' };
};
