import { readFileSync, writeFileSync } from 'fs';
import { TwitterApi } from 'twitter-api-v2';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

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

const appKey = process.env.TWITTER_API_KEY;
const appSecret = process.env.TWITTER_API_SECRET;
let twitterAccounts: TwitterAccounts | null = null;
const loggedInClients: Map<string, TwitterApi> = new Map();

let tempAuthDetails: TwitterTempAuth | null = null;

/**
 * load Twitter account information from 'twitter-accounts.json' for userId
 * @param userId
 */
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

/**
 * returns Twitter account data from 'twitter-accounts.json'
 */
function loadTwitterAccounts(): TwitterAccounts {
	if (twitterAccounts !== null) {
		return twitterAccounts;
	}
	try {
		const fileContent = readFileSync('./data/twitter-accounts.json').toString();
		twitterAccounts = <TwitterAccounts>JSON.parse(fileContent);
	} catch (e) {
		twitterAccounts = { accounts: [] };
	}
	return twitterAccounts;
}

/**
 * returns account information for passed in Twitter userId, null if account not found
 * @param userId
 */
function loadAuthDetails(userId: string): TwitterAuthDetails | null {
	const data = loadTwitterAccounts();
	for (const a of data.accounts) {
		if (a.account.userId === userId) {
			return a;
		}
	}
	return null;
}

/**
 * add or delete account(s) to 'twitter-accounts.json' file
 * 'data' contains this information before being written
 * @param authDetails
 */
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

/**
 * data contained within 'twitterAccounts' variable is converted to JSON and written to 'twitter-accounts.json'
 */
function persistTwitterDetails(): void {
	writeFileSync('./data/twitter-accounts.json', JSON.stringify(twitterAccounts));
}

/**
 * returns true if the oauth access token and secret are set
 * @param authDetails
 */
function fullyAuthorized(authDetails: TwitterAuthDetails): boolean {
	return authDetails.accessToken !== '' && authDetails.accessSecret !== '';
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

/**
 * oauth step one: requests an oauth token from Twitter, the user can then use this token to log into their
 * Twitter account
 * @param callbackUrl
 */
export async function initializeAuthorization(callbackUrl: string): Promise<string> {
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

	return authLink.oauth_token;
}

/**
 * oauth step two: once user logs in using the oauth token from step 1, Twitter will return an access token
 * and access secret, this information can then be used by the applicant to act as the logged-in user
 * this information is then saved to 'twitter-accounts.json' (db in future)
 * @param oauthVerifier
 * @param oauthTokenFromCallback
 */
export async function completeLogin(oauthVerifier: string, oauthTokenFromCallback: string): Promise<TwitterApi> {
	errorOnUnsetKeyAndSecret();

	console.assert(tempAuthDetails !== null);
	console.log(
		`[TW] oauth_token_from_callback (${oauthTokenFromCallback}) === oauth_token ${tempAuthDetails?.oauthToken}`,
	);
	console.assert(oauthTokenFromCallback === tempAuthDetails?.oauthToken);
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
	const authDetails: TwitterAuthDetails = {
		accessToken: loginResult.accessToken,
		accessSecret: loginResult.accessSecret,
		account: {
			screenName: loginResult.screenName,
			userId: loginResult.userId,
		},
	};

	// save/update account to file
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
