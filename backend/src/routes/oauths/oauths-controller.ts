import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getTwitterOAuthRequestToken, getTwitterAccountByRequestToken, insertTwitterOAuth } from './oauths-model';
import { TwitterOAuthRequestToken } from './oauths';
import { ServerError } from '../types';
import { insertAccount } from '../accounts/accounts-model';
import { getTwitterUser, insertTwitterUser } from '../twitter-users/twitter-users-model';
import { handleServerError } from '../util';

// need a better solution than to store temp auth in a variable
let tempAuthDetails: TwitterOAuthRequestToken;

export const requestToken = async (ctx: ParameterizedContext): Promise<void> => {
	const result = await getTwitterOAuthRequestToken();

	if (result instanceof ServerError) {
		ctx.status = result.getStatusCode();
		ctx.body = { message: result.getMessage() };
		return;
	}

	// store request token
	tempAuthDetails = result;

	ctx.status = HttpStatus.OK;
	ctx.body = { oauthToken: result.oauthToken };
};

export const accessToken = async (ctx: ParameterizedContext): Promise<void> => {
	const { token, verifier } = ctx.request.body;

	if (!token || !verifier || !tempAuthDetails) {
		ctx.status = HttpStatus.BAD_REQUEST;
		return;
	}

	const twitterAccount = await getTwitterAccountByRequestToken(tempAuthDetails, token, verifier);
	console.log(twitterAccount);

	if (twitterAccount instanceof ServerError) {
		handleServerError(ctx, twitterAccount);
		return;
	}

	// 1. store Twitter user
	const twitterUserExists = await getTwitterUser(twitterAccount.userId);
	if (!twitterUserExists) {
		const insertTwitterUserResult = await insertTwitterUser(twitterAccount);

		if (insertTwitterUserResult instanceof ServerError) {
			handleServerError(ctx, insertTwitterUserResult);
			return;
		}
	}

	// 2. create account
	if (!ctx.session) {
		ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
		ctx.body = { message: 'Failed to retrieve user id.' };
		return;
	}

	const { userId } = ctx.session;
	const twitterUserId = BigInt(twitterAccount.userId);

	const accountId = await insertAccount(userId, twitterUserId);
	if (accountId instanceof ServerError) {
		handleServerError(ctx, accountId);
		return;
	}

	// 3. using account id, store oAuth credentials
	const { accessToken, accessSecret } = twitterAccount.oauth;
	if (accessToken && accessSecret) {
		const insertOAuthResult = await insertTwitterOAuth(accountId, accessToken, accessSecret);

		if (insertOAuthResult instanceof ServerError) {
			handleServerError(ctx, insertOAuthResult);
			return;
		}

		// remove oAuth credentials before sending user
		twitterAccount.oauth = {};

		// success
		ctx.status = HttpStatus.CREATED;
		ctx.body = twitterAccount;
	}

	ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
};
