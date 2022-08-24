import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { insertUser } from '../models/user-model';

export const user = async (ctx: ParameterizedContext): Promise<void> => {
	const { userId } = ctx.params;
	console.log(userId);

	ctx.status = HttpStatus.OK;
	ctx.body = { message: 'Account not found.' };
};

export const createUser = async (ctx: ParameterizedContext): Promise<void> => {
	const { username, password } = ctx.request.body;

	if (await insertUser(username, password)) {
		ctx.status = HttpStatus.CREATED;
		return;
	}

	ctx.status = HttpStatus.CONFLICT;
	ctx.body = { error: 'Username taken' };
};
