import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getTwitterUser } from './twitter-users-model';

interface TwitterUser {
	id: bigint;
}

export const twitterUser = async (ctx: ParameterizedContext): Promise<void> => {
	const { id }: TwitterUser = ctx.params;

	if (!id || id <= 0) {
		ctx.status = HttpStatus.BAD_REQUEST;
		return;
	}

	const result = await getTwitterUser(id);

	ctx.status = HttpStatus.OK;
	ctx.body = result;
};

export const createTwitterUser = async (ctx: ParameterizedContext): Promise<void> => {
	console.log('NOT IMPLEMENTED');
	ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
};
