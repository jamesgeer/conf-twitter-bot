import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getTwitterUser } from './twitter-users-model';

export const twitterUser = async (ctx: ParameterizedContext): Promise<void> => {
	const { id: twitterUserId } = ctx.params;
	console.log(twitterUserId);
	const result = await getTwitterUser(twitterUserId);
	console.log(result);

	ctx.status = HttpStatus.OK;
	ctx.body = result;
};

export const twitterUsers = async (ctx: ParameterizedContext): Promise<void> => {
	console.log('NOT IMPLEMENTED');
	ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
};

export const createTwitterUser = async (ctx: ParameterizedContext): Promise<void> => {
	console.log('NOT IMPLEMENTED');
	ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
};
