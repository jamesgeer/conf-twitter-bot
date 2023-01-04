import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getUser, insertUser } from './users-model';
import { ServerError } from '../types';
import { userLogin } from '../sessions/sessions-controller';
import { handleServerError } from '../util';

export const user = async (ctx: ParameterizedContext): Promise<void> => {
	const { userId } = ctx.params;

	const result = await getUser(userId);
	if (result instanceof ServerError) {
		handleServerError(ctx, result);
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = result;
};

export const createUser = async (ctx: ParameterizedContext): Promise<void> => {
	const { username, password } = ctx.request.body;

	if (!username || !password) {
		ctx.status = HttpStatus.BAD_REQUEST;
		return;
	}

	const result = await insertUser(username, password);
	if (result instanceof ServerError) {
		handleServerError(ctx, result);
		return;
	}

	// once created, log user in
	await userLogin(ctx);

	// account successfully created and logged in
	ctx.status = HttpStatus.CREATED;
	ctx.body = result;
};
