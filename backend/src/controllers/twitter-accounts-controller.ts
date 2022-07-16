import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getAccount, getAccounts } from '../models/twitter-accounts.model';

const account = async (ctx: ParameterizedContext): Promise<void> => {
	const { userId } = ctx.params;
	const twitterAccount = getAccount(userId);

	if (twitterAccount) {
		ctx.status = HttpStatus.OK;
		ctx.body = { userId: twitterAccount.userId, screenName: twitterAccount.screenName };
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = { message: 'Account not found.' };
};

const accounts = async (ctx: ParameterizedContext): Promise<void> => {
	const twitterAccounts = getAccounts();

	if (twitterAccounts.length > 0) {
		const accounts = twitterAccounts.map((account) => ({
			userId: account.userId,
			screenName: account.screenName,
		}));

		ctx.status = HttpStatus.OK;
		ctx.body = accounts;
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = { message: 'No accounts found.' };
};

export { account, accounts };
