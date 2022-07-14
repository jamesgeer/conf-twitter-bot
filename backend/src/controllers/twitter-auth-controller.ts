import HttpStatus from 'http-status';
import { TwitterApi } from 'twitter-api-v2';
import * as dotenv from 'dotenv';
import { ParameterizedContext } from 'koa';
import { TwitterAccount, TwitterOAuthRequestToken } from '../types/twitter-types';
import { insertOrUpdateAccount } from '../models/twitter-auth-model';

dotenv.config({ path: '../../.env' });

const appKey = process.env.TWITTER_API_KEY;
const appSecret = process.env.TWITTER_API_SECRET;

const loggedInClients: Map<string, TwitterApi> = new Map();
let tempAuthDetails: TwitterOAuthRequestToken;

const requestToken = async (ctx: ParameterizedContext): Promise<void> => {
	console.log('[TW] Instantiate API Object');

	const client = new TwitterApi({
		appKey: <string>appKey,
		appSecret: <string>appSecret,
	});

	const callbackUrl = 'http://localhost:3000';

	console.log('[TW] Generate Auth Link');
	console.log(`[TW] ${JSON.stringify({ appKey, appSecret, callbackUrl })}`);

	const authLink = await client.generateAuthLink(callbackUrl);

	tempAuthDetails = {
		oauthToken: authLink.oauth_token,
		oauthTokenSecret: authLink.oauth_token_secret,
	};

	ctx.status = HttpStatus.OK;
	ctx.body = { oauthToken: authLink.oauth_token };
};

const accessToken = async (ctx: ParameterizedContext): Promise<void> => {
	const { oauth_verifier: oauthVerifier, oauth_token: oauthToken } = ctx.request.body;

	console.assert(tempAuthDetails !== null);
	console.log(`[TW] oauth_token_from_callback (${oauthToken}) === oauth_token ${tempAuthDetails?.oauthToken}`);
	console.assert(oauthToken === tempAuthDetails?.oauthToken);
	console.log(`[TW] oauth_verifier (${oauthVerifier})`);

	// set all credentials required to make oauth request
	const client = new TwitterApi({
		appKey: <string>appKey,
		appSecret: <string>appSecret,
		accessToken: tempAuthDetails?.oauthToken,
		accessSecret: tempAuthDetails?.oauthTokenSecret,
	});

	// using credentials, log into user's Twitter account and store response
	const loginResult = await client.login(oauthVerifier);
	loggedInClients.set(loginResult.userId, loginResult.client);

	// gather account credentials and information for store
	const { userId, screenName, accessToken, accessSecret } = loginResult;

	const twitterAccount: TwitterAccount = {
		userId,
		screenName,
		oauth: {
			accessToken,
			accessSecret,
		},
	};

	// save/update account to file
	insertOrUpdateAccount(twitterAccount);

	console.log('[TW] Login completed');
	ctx.status = HttpStatus.OK;
};

export { requestToken, accessToken };
