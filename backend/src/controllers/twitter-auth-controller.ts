import HttpStatus from 'http-status';
import { ParameterizedContext } from 'koa';
import { TwitterOAuthRequestToken } from '../types/twitter-types';
import { insertOrUpdateAccount } from '../models/twitter-accounts.model';
import { getRequestToken, getTwitterAccount } from '../models/twitter-auth-model';

// need a better solution than to store temp auth in a variable
let tempAuthDetails: TwitterOAuthRequestToken;

const requestToken = async (ctx: ParameterizedContext): Promise<void> => {
	const tempAuthDetails = await getRequestToken();
	if (tempAuthDetails) {
		ctx.status = HttpStatus.OK;
		ctx.body = { oauthToken: tempAuthDetails.oauthToken };
		return;
	}

	ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
	ctx.body = { error: 'Request token could not be generated.' };
};

const accessToken = async (ctx: ParameterizedContext): Promise<void> => {
	const { oauth_verifier: oauthVerifier, oauth_token: oauthToken } = ctx.request.body;
	const twitterAccount = await getTwitterAccount(tempAuthDetails, oauthVerifier, oauthToken);

	if (twitterAccount.userId.length > 0) {
		// save/update account to file
		insertOrUpdateAccount(twitterAccount);

		console.log('[TW] Login completed');
		ctx.status = HttpStatus.OK;
		return;
	}

	ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
	ctx.body = { error: 'Twitter authorisation rejected' };
};

export { requestToken, accessToken };
