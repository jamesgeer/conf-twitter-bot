import HttpStatus from 'http-status';
import { ParameterizedContext } from 'koa';
import { TwitterOAuthRequestToken } from '../types/twitter-types';
import { insertOrUpdateAccount } from '../models/twitter-accounts.model';
import { getTwitterOAuthRequestToken, getTwitterAccountByRequestToken } from '../models/twitter-auth-model';

// need a better solution than to store temp auth in a variable
let tempAuthDetails: TwitterOAuthRequestToken;

const requestToken = async (ctx: ParameterizedContext): Promise<void> => {
	const tempAuthDetails = await getTwitterOAuthRequestToken();

	if ('error' in tempAuthDetails) {
		ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
		ctx.body = { error: tempAuthDetails.message };
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = { oauthToken: tempAuthDetails.oauthToken };
};

const accessToken = async (ctx: ParameterizedContext): Promise<void> => {
	const { oauth_verifier: oauthVerifier, oauth_token: oauthToken } = ctx.request.body;
	const twitterAccount = await getTwitterAccountByRequestToken(tempAuthDetails, oauthVerifier, oauthToken);

	if ('error' in twitterAccount) {
		ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
		ctx.body = { error: twitterAccount.message };
		return;
	}

	// save/update account to file
	insertOrUpdateAccount(twitterAccount);
	console.log('[TW] Login completed');

	ctx.status = HttpStatus.OK;
};

export { requestToken, accessToken };
