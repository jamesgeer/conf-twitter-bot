import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getAccount, getAccounts } from './accounts-model';

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
	const userAccounts = await getAccounts(ctx.session.userId);

	ctx.status = HttpStatus.OK;
	ctx.body = userAccounts;
};
