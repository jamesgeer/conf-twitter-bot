import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getAccounts } from './accounts-model';

// needs to be updated
export const account = async (ctx: ParameterizedContext): Promise<void> => {
	const { userId } = ctx.params;
	// const twitterAccount = getAccount(userId);
	const twitterAccount = await getAccounts(userId)[0]; // temp -> remove

	if (twitterAccount) {
		ctx.status = HttpStatus.OK;
		ctx.body = {
			userId: twitterAccount.userId,
			name: twitterAccount.name,
			screenName: twitterAccount.screenName,
			profileImageUrl: twitterAccount.profileImageUrl,
		};
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = { message: 'Account not found.' };
};

export const accounts = async (ctx: ParameterizedContext): Promise<void> => {
	const userAccounts = await getAccounts(ctx.session.userId);

	if (userAccounts.length > 0) {
		ctx.status = HttpStatus.OK;
		ctx.body = userAccounts;
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = { message: 'No accounts found.' };
};
