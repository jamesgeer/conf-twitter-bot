import HttpStatus from 'http-status';
import { ParameterizedContext } from 'koa';
import { getTwitterOAuthRequestToken, getTwitterAccountByRequestToken, insertTwitterOAuth } from './oauths-model';
import { TwitterOAuthRequestToken } from './oauths';
import { ServerError } from '../types';
import { insertAccount } from '../accounts/accounts-model';
import { insertTwitterUser } from '../twitter-users/twitter-users-model';

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

// TODO: See if this error handle can be abstracted
export const accessToken = async (ctx: ParameterizedContext): Promise<void> => {
	const { token: oauthToken, verifier: oauthVerifier } = ctx.request.body;
	const twitterAccount = await getTwitterAccountByRequestToken(tempAuthDetails, oauthToken, oauthVerifier);

	if (twitterAccount instanceof ServerError) {
		ctx.status = twitterAccount.getStatusCode();
		ctx.body = { message: twitterAccount.getMessage() };
		return;
	}

	// 1. store Twitter user
	const insertTwitterUserResult = await insertTwitterUser(twitterAccount);

	if (insertTwitterUserResult instanceof ServerError) {
		console.log(insertTwitterUserResult.getMessage());
		ctx.status = insertTwitterUserResult.getStatusCode();
		ctx.body = { message: insertTwitterUserResult.getMessage() };
		return;
	}

	// 2. create account
	const { userId } = ctx.session;
	const twitterUserId = BigInt(twitterAccount.userId);
	const accountId = await insertAccount(userId, twitterUserId);

	if (accountId instanceof ServerError) {
		console.log(accountId.getMessage());
		ctx.status = accountId.getStatusCode();
		ctx.body = { message: accountId.getMessage() };
		return;
	}

	// 3. using account id, store oAuth credentials
	const { accessToken: token, accessSecret: secret } = twitterAccount.oauth;
	const insertOAuthResult = await insertTwitterOAuth(accountId, token, secret);

	if (insertOAuthResult instanceof ServerError) {
		console.log(insertOAuthResult.getMessage());
		ctx.status = insertOAuthResult.getStatusCode();
		ctx.body = { message: insertOAuthResult.getMessage() };
		return;
	}

	// remove oAuth credentials before sending user
	twitterAccount.oauth = null;

	// success
	ctx.status = HttpStatus.CREATED;
	ctx.body = twitterAccount;
};
