import { TwitterApi } from 'twitter-api-v2';
import * as dotenv from 'dotenv';
import { TwitterOAuthRequestToken, TwitterAccount, TwitterError } from '../types/twitter-types';

dotenv.config({ path: '../../.env' });

const appKey = process.env.TWITTER_API_KEY;
const appSecret = process.env.TWITTER_API_SECRET;

const getTwitterOAuthRequestToken = async (): Promise<TwitterOAuthRequestToken | TwitterError> => {
	const client = new TwitterApi({
		appKey: <string>appKey,
		appSecret: <string>appSecret,
	});

	const callbackUrl = 'http://localhost:3000';
	const authLink = await client.generateAuthLink(callbackUrl);

	if (authLink && authLink.oauth_token.length > 0) {
		return {
			oauthToken: authLink.oauth_token,
			oauthTokenSecret: authLink.oauth_token_secret,
		};
	}

	return { error: true, message: 'Unable to generate request token.' };
};

const getTwitterAccountByRequestToken = async (
	tempAuthDetails: TwitterOAuthRequestToken,
	oauthVerifier: string,
	oauthToken: string,
): Promise<TwitterAccount | TwitterError> => {
	if (oauthToken !== tempAuthDetails.oauthToken) {
		return { error: true, message: 'oAuth Tokens do not match.' };
	}

	// set all credentials required to make oauth request
	const client = new TwitterApi({
		appKey: <string>appKey,
		appSecret: <string>appSecret,
		accessToken: tempAuthDetails?.oauthToken,
		accessSecret: tempAuthDetails?.oauthTokenSecret,
	});

	// using credentials, log into user's Twitter account to get access token and user details
	const loginResult = await client.login(oauthVerifier);

	if (loginResult && loginResult.accessSecret.length > 0) {
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
	}

	return { error: true, message: 'Unable to create access token.' };
};

export { getTwitterOAuthRequestToken, getTwitterAccountByRequestToken };
