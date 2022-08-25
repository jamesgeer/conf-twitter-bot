import HttpStatus from 'http-status';
import { ParameterizedContext } from 'koa';
import { insertOrUpdateAccount } from '../accounts/accounts-model';
import { getTwitterOAuthRequestToken, getTwitterAccountByRequestToken } from './oauths-model';
import { TwitterOAuthRequestToken } from './oauths';

// need a better solution than to store temp auth in a variable
let tempAuthDetails: TwitterOAuthRequestToken;

export const requestToken = async (ctx: ParameterizedContext): Promise<void> => {
	const oAuthRequestToken = await getTwitterOAuthRequestToken();

	if ('error' in oAuthRequestToken) {
		ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
		ctx.body = { error: oAuthRequestToken.message };
		return;
	}

	// store request token
	tempAuthDetails = oAuthRequestToken;

	ctx.status = HttpStatus.OK;
	ctx.body = { oauthToken: oAuthRequestToken.oauthToken };
};

export const accessToken = async (ctx: ParameterizedContext): Promise<void> => {
	const { oauth_verifier: oauthVerifier, oauth_token: oauthToken } = ctx.request.body;
	const twitterAccount = await getTwitterAccountByRequestToken(tempAuthDetails, oauthVerifier, oauthToken);

	if ('error' in twitterAccount) {
		ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
		ctx.body = { error: twitterAccount.message };
		return;
	}

	// save/update account to file and if successful return account details
	if (insertOrUpdateAccount(twitterAccount)) {
		ctx.status = HttpStatus.CREATED;
		ctx.body = {
			userId: twitterAccount.userId,
			screenName: twitterAccount.screenName,
			profileImageUrl: twitterAccount.profileImageUrl,
		};
		return;
	}

	ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
	ctx.body = { error: 'Twitter account could not be stored.' };
};
