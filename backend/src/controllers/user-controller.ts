import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';

export const user = async (ctx: ParameterizedContext): Promise<void> => {
	const { userId } = ctx.params;
	console.log(userId);

	ctx.status = HttpStatus.OK;
	ctx.body = { message: 'Account not found.' };
};

export const createUser = async (ctx: ParameterizedContext): Promise<void> => {
	const { username, password } = ctx.request.body;

	console.log(username, password);

	// success
	ctx.status = HttpStatus.CREATED;
};
