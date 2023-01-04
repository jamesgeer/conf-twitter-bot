import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getTwitterOAuthRequestToken, getTwitterAccountByRequestToken, insertTwitterOAuth } from './oauths-model';
import { TwitterOAuthRequestToken } from './oauths';
import { ServerError } from '../types';
import { insertAccount } from '../accounts/accounts-model';
import { insertTwitterUser, twitterUserExistsForAccount } from '../twitter-users/twitter-users-model';
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
	// @ts-ignore
	const { userId } = ctx.session;

	if (!ctx.session || !userId) {
		ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
		ctx.body = { message: 'Failed to retrieve user id.' };
		return;
	}

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
	const isAlreadyAdded = await twitterUserExistsForAccount(userId, twitterAccount.twitterUser.id);
	if (isAlreadyAdded) {
		ctx.status = HttpStatus.CONFLICT;
		ctx.body = { message: 'User already exists.' };
		return;
	}

	const insertTwitterUserResult = await insertTwitterUser(twitterAccount.twitterUser);
	if (insertTwitterUserResult instanceof ServerError) {
		handleServerError(ctx, insertTwitterUserResult);
		return;
	}

	// 2. create account
	const twitterUserId = twitterAccount.twitterUser.id;

	const accountId = await insertAccount(userId, twitterUserId);
	if (accountId instanceof ServerError) {
		handleServerError(ctx, accountId);
		return;
	}

	// 3. using account id, store oAuth credentials
	const { accessToken, accessSecret } = twitterAccount.oauth;
	if (!accessToken || !accessSecret) {
		ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
		return;
	}

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
};
