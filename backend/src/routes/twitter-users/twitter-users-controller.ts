import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getTwitterUser } from './twitter-users-model';

export const twitterUser = async (ctx: ParameterizedContext): Promise<void> => {
	const { id: twitterUserId } = ctx.params;
	const result = await getTwitterUser(twitterUserId);

	ctx.status = HttpStatus.OK;
	ctx.body = result;
};

export const createTwitterUser = async (ctx: ParameterizedContext): Promise<void> => {
	console.log('NOT IMPLEMENTED');
	ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
};
