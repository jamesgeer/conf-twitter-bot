import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getAccount, getAccounts } from '../models/twitter-accounts.model';

const account = async (ctx: ParameterizedContext): Promise<void> => {
	const { userId } = ctx.params;
	const twitterAccount = getAccount(userId);

	if (twitterAccount) {
		ctx.status = HttpStatus.OK;
		ctx.body = {
			userId: twitterAccount.userId,
			screenName: twitterAccount.screenName,
			profileImageUrl: twitterAccount.profileImageUrl,
		};
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
			profileImageUrl: account.profileImageUrl,
		}));

		ctx.status = HttpStatus.OK;
		ctx.body = accounts;
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = { message: 'No accounts found.' };
};

export { account, accounts };
