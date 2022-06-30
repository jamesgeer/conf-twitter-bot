import { readFileSync, writeFileSync } from 'fs';
import { TwitterApi } from 'twitter-api-v2';
import { Tweet } from './data-types.js';
import { dataUrlToBuffer } from './data.js';
import { robustPath } from './util.js';

const dataFilePath = robustPath('../twitter-accounts.json');

interface TwitterAccount {
	screenName: string;
	userId: string;
	profileImageUrl?: string;
}

/** Authentication details, that are persisted. */
interface TwitterAuthDetails {
	/* persistent */
	accessToken?: string;
	accessSecret?: string;
	account: TwitterAccount;
}

interface TwitterAccounts {
	accounts: TwitterAuthDetails[];
}

/** Authentication details, used during the login/authentication process. */
interface TwitterTempAuth {
	/* temporary */
	oauthToken?: string;
	oauthTokenSecret?: string;
}

let appKey: string | null = null;
let appSecret: string | null = null;
let twitterAccounts: TwitterAccounts | null = null;
const loggedInClients: Map<string, TwitterApi> = new Map();

let tempAuthDetails: TwitterTempAuth | null = null;

export async function getTwitterDetails(userId: string): Promise<TwitterAccount | null> {
	const data = loadTwitterAccounts();
	const details = data.accounts.find((a) => a.account.userId === userId);
	if (!details) {
		return null;
	}

	const { account } = details;

	if (!account.profileImageUrl) {
		const client = new TwitterApi({
			appKey: <string>appKey,
			appSecret: <string>appSecret,
		});
		account.profileImageUrl = await getProfileImageUrl(client, account.userId);
	}
	return account;
}

export async function getKnownTwitterAccounts(): Promise<TwitterAccount[]> {
	const data = loadTwitterAccounts();
	const knownAccounts = data.accounts.map((auth) => auth.account);

	let client;
	for (const a of knownAccounts) {
		if (!a.profileImageUrl) {
			if (!client) {
				client = new TwitterApi({
					appKey: <string>appKey,
					appSecret: <string>appSecret,
				});
			}
			// eslint-disable-next-line no-await-in-loop
			a.profileImageUrl = await getProfileImageUrl(client, a.userId);
		}
	}

	if (client) {
		persistTwitterDetails();
	}
	return knownAccounts;
}

async function getProfileImageUrl(client: TwitterApi, userId: string) {
	return (await client.v1.user({ user_id: userId })).profile_image_url_https;
}

export function initTwitterKeys(key: string, secret: string): void {
	appKey = key;
	appSecret = secret;
}

function loadTwitterAccounts(): TwitterAccounts {
	if (twitterAccounts !== null) {
		return twitterAccounts;
	}
	try {
		const fileContent = readFileSync(dataFilePath).toString();
		twitterAccounts = <TwitterAccounts>JSON.parse(fileContent);
	} catch (e) {
		twitterAccounts = { accounts: [] };
	}
	return twitterAccounts;
}

function loadAuthDetails(userId: string): TwitterAuthDetails | null {
	const data = loadTwitterAccounts();
	for (const a of data.accounts) {
		if (a.account.userId === userId) {
			return a;
		}
	}
	return null;
}

function addOrUpdate(authDetails: TwitterAuthDetails) {
	const data = loadTwitterAccounts();
	let update = false;

	// eslint-disable-next-line guard-for-in
	for (const i in data.accounts) {
		const a = data.accounts[i];
		if (a.account.userId === authDetails.account.userId) {
			data.accounts[i] = authDetails;
			update = true;
			break;
		}
	}

	if (!update) {
		data.accounts.push(authDetails);
	}
	persistTwitterDetails();
}

function persistTwitterDetails() {
	writeFileSync(dataFilePath, JSON.stringify(twitterAccounts));
}

function fullyAuthorized(authDetails: TwitterAuthDetails) {
	return authDetails.accessToken && authDetails.accessSecret;
}

function getClientForUser(userId: string): TwitterApi | null {
	const authDetails = loadAuthDetails(userId);
	if (authDetails && fullyAuthorized(authDetails)) {
		console.log('[TW] Fully Authorized already.');
		const loggedInClient = loggedInClients.get(userId);

		if (loggedInClient) {
			return loggedInClient;
		}
		return loginFullyAuthorized(authDetails);
	}

	return null;
}

function errorOnUnsetKeyAndSecret() {
	if (!appKey || !appSecret) {
		throw new Error('Please make sure TWITTER_API_KEY and TWITTER_API_SECRET are set in the environment');
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function initializeAuthorization(callbackUrl: string, redirectUrl: string): Promise<string> {
	errorOnUnsetKeyAndSecret();

	console.log('[TW] Instantiate API Object');

	const client = new TwitterApi({
		appKey: <string>appKey,
		appSecret: <string>appSecret,
	});

	console.log('[TW] Generate Auth Link');
	console.log(`[TW] ${JSON.stringify({ appKey, appSecret, callbackUrl })}`);

	const authLink = await client.generateAuthLink(callbackUrl); // , { linkMode: 'authorize'}

	tempAuthDetails = {
		oauthToken: authLink.oauth_token,
		oauthTokenSecret: authLink.oauth_token_secret,
	};

	return authLink.url;
}

export async function completeLogin(oauthVerifier: string, oauthTokenFromCallback: string): Promise<TwitterApi> {
	errorOnUnsetKeyAndSecret();
	console.assert(tempAuthDetails !== null);

	console.log(
		`[TW] oauth_token_from_callback (${oauthTokenFromCallback}) === oauth_token ${tempAuthDetails?.oauthToken}`,
	);
	console.assert(oauthTokenFromCallback === tempAuthDetails?.oauthToken);

	console.log(`[TW] oauth_verifier (${oauthVerifier})`);
	const client = new TwitterApi({
		appKey: <string>appKey,
		appSecret: <string>appSecret,
		accessToken: tempAuthDetails?.oauthToken,
		accessSecret: tempAuthDetails?.oauthTokenSecret,
	});

	const loginResult = await client.login(oauthVerifier);
	loggedInClients.set(loginResult.userId, loginResult.client);

	const authDetails: TwitterAuthDetails = {
		accessToken: loginResult.accessToken,
		accessSecret: loginResult.accessSecret,
		account: {
			screenName: loginResult.screenName,
			userId: loginResult.userId,
		},
	};

	addOrUpdate(authDetails);

	console.log('[TW] Login completed');
	return loginResult.client;
}

function loginFullyAuthorized(authDetails: TwitterAuthDetails): TwitterApi {
	errorOnUnsetKeyAndSecret();

	const loggedInClient = new TwitterApi({
		appKey: <string>appKey,
		appSecret: <string>appSecret,
		accessToken: authDetails.accessToken,
		accessSecret: authDetails.accessSecret,
	});
	loggedInClients.set(authDetails.account.userId, loggedInClient);
	return loggedInClient;
}

export async function createTweetWithImage(tweet: Tweet): Promise<boolean> {
	if (!tweet.userId) {
		console.log('[TW] Tweet did not have a userId');
		return false;
	}

	const loggedInClient = getClientForUser(tweet.userId);
	if (loggedInClient === null) {
		console.log('[TW] Not logged in, cannot send tweet');
		return false;
	}

	console.log(`[TW] Prepare Tweet ${tweet.id}`);
	const imageBuffer = dataUrlToBuffer(tweet.image);

	const mediaId = await loggedInClient.v1.uploadMedia(imageBuffer, {
		type: 'png',
	});
	await loggedInClient.v1.tweet(tweet.text, { media_ids: [mediaId] });
	console.log(`[TW] Tweet sent ${tweet.id}`);
	return true;
}
