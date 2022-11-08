import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getUser, insertUser } from './users-model';
import { ServerError } from '../types';
import { userLogin } from '../sessions/sessions-controller';

export const user = async (ctx: ParameterizedContext): Promise<void> => {
	const { userId } = ctx.params;
	const result = await getUser(userId);

	if (result) {
		ctx.status = HttpStatus.OK;
		ctx.body = result;
		return;
	}

	ctx.status = HttpStatus.NOT_FOUND;
	ctx.body = { message: 'No user with that ID exists.' };
};

export const createUser = async (ctx: ParameterizedContext): Promise<void> => {
	const { username, password } = ctx.request.body;

	const result = await insertUser(username, password);
	if (result instanceof ServerError) {
		ctx.status = result.getStatusCode();
		ctx.body = { message: result.getMessage() };
		return;
	}

	// once created, log user in
	await userLogin(ctx);

	// account successfully created and logged in
	ctx.status = HttpStatus.CREATED;
	ctx.body = result.id; // userId
};
