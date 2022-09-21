import HttpStatus from 'http-status';
import { ParameterizedContext } from 'koa';
import { getTwitterOAuthRequestToken, getTwitterAccountByRequestToken } from './oauths-model';
import { TwitterOAuthRequestToken } from './oauths';
import { ServerError } from '../types';

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
	const { oauth_verifier: oauthVerifier, oauth_token: oauthToken } = ctx.request.body;
	const result = await getTwitterAccountByRequestToken(tempAuthDetails, oauthVerifier, oauthToken);

	if (result instanceof ServerError) {
		ctx.status = result.getStatusCode();
		ctx.body = { message: result.getMessage() };
		return;
	}

	// save/update account to file and if successful return account details
	// if (insertOrUpdateAccount(twitterAccount)) {
	// 	ctx.status = HttpStatus.CREATED;
	// 	ctx.body = {
	// 		userId: twitterAccount.userId,
	// 		screenName: twitterAccount.screenName,
	// 		profileImageUrl: twitterAccount.profileImageUrl,
	// 	};
	// 	return;
	// }

	ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
	ctx.body = { error: 'Twitter account could not be stored.' };
};
