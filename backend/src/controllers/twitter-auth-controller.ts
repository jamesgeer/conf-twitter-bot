import HttpStatus from 'http-status';
import { TwitterApi } from 'twitter-api-v2';
import * as dotenv from 'dotenv';
import { ParameterizedContext } from 'koa';

dotenv.config({ path: '../../.env' });

const appKey = process.env.TWITTER_API_KEY;
const appSecret = process.env.TWITTER_API_SECRET;

/** Authentication details, used during the login/authentication process. */
interface TwitterTempAuth {
	oauthToken?: string;
	oauthTokenSecret?: string;
}

let tempAuthDetails: TwitterTempAuth | null = null;

const requestToken = async (ctx: ParameterizedContext): Promise<void> => {
	console.log('[TW] Instantiate API Object');

	const client = new TwitterApi({
		appKey: <string>appKey,
		appSecret: <string>appSecret,
	});

	const callbackUrl = 'http://localhost:3000';

	console.log('[TW] Generate Auth Link');
	console.log(`[TW] ${JSON.stringify({ appKey, appSecret, callbackUrl })}`);

	const authLink = await client.generateAuthLink(callbackUrl); // , { linkMode: 'authorize'}

	tempAuthDetails = {
		oauthToken: authLink.oauth_token,
		oauthTokenSecret: authLink.oauth_token_secret,
	};

	ctx.status = HttpStatus.OK;
	ctx.body = { oauthToken: authLink.oauth_token };
};

const accessToken = async (ctx: ParameterizedContext): Promise<void> => {
	const { oauth_token, oauth_verifier } = ctx.request.body;
};

export { requestToken, accessToken };
