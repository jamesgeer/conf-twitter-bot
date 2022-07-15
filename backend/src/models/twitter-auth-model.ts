import { TwitterApi } from 'twitter-api-v2';
import * as dotenv from 'dotenv';
import { TwitterOAuthRequestToken, TwitterAccount } from '../types/twitter-types';

dotenv.config({ path: '../../.env' });

const appKey = process.env.TWITTER_API_KEY;
const appSecret = process.env.TWITTER_API_SECRET;

const getRequestToken = async (): Promise<TwitterOAuthRequestToken> => {
	console.log('[TW] Instantiate API Object');

	const client = new TwitterApi({
		appKey: <string>appKey,
		appSecret: <string>appSecret,
	});

	const callbackUrl = 'http://localhost:3000';

	console.log('[TW] Generate Auth Link');
	console.log(`[TW] ${JSON.stringify({ appKey, appSecret, callbackUrl })}`);

	const authLink = await client.generateAuthLink(callbackUrl);

	return {
		oauthToken: authLink.oauth_token,
		oauthTokenSecret: authLink.oauth_token_secret,
	};
};

const getTwitterAccount = async (
	tempAuthDetails: TwitterOAuthRequestToken,
	oauthVerifier: string,
	oauthToken: string,
): Promise<TwitterAccount> => {
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

	// using credentials, log into user's Twitter account to get access token and user details
	const loginResult = await client.login(oauthVerifier);

	// gather account credentials and information for store
	const { userId, screenName, accessToken, accessSecret } = loginResult;

	// return TwitterAccount
	return {
		userId,
		screenName,
		oauth: {
			accessToken,
			accessSecret,
		},
	};
};

export { getRequestToken, getTwitterAccount };
