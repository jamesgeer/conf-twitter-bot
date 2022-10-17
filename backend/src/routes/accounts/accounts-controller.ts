import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getAccount, getAccounts, deleteAccount } from './accounts-model';
import { ServerError } from '../types';

export const account = async (ctx: ParameterizedContext): Promise<void> => {
	const { id: accountId } = ctx.params;
	const account = await getAccount(accountId);

	if (account) {
		ctx.status = HttpStatus.OK;
		ctx.body = account;
		return;
	}

	ctx.status = HttpStatus.NOT_FOUND;
	ctx.body = { message: 'Account not found.' };
};

export const accounts = async (ctx: ParameterizedContext): Promise<void> => {
	if (!ctx.session) {
		ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
		return;
	}
	const userAccounts = await getAccounts(ctx.session.userId);

	ctx.status = HttpStatus.OK;
	ctx.body = userAccounts;
};

export const removeAccount = async (ctx: ParameterizedContext): Promise<void> => {
	const { id } = ctx.params;
	if (id.length === 0) {
		ctx.status = HttpStatus.UNAUTHORIZED;
		return;
	}
	const result = deleteAccount(id);
	if (result instanceof ServerError) {
		ctx.status = result.getStatusCode();
		ctx.body = { message: result.getMessage() };
		return;
	}
	ctx.status = HttpStatus.OK;
};
