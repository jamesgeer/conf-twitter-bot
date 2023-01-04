import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getTwitterUser } from './twitter-users-model';
import { ServerError } from '../types';
import { handleServerError } from '../util';

export const twitterUser = async (ctx: ParameterizedContext): Promise<void> => {
	const { id }: { id: string } = ctx.params;
	const userId = BigInt(id);

	if (!userId || userId <= 0) {
		ctx.status = HttpStatus.BAD_REQUEST;
		return;
	}

	const result = await getTwitterUser(userId);
	if (result instanceof ServerError) {
		handleServerError(ctx, result);
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = result;
};
