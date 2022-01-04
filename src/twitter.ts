import { readFileSync, writeFileSync } from 'fs';
import { TwitterApi } from "twitter-api-v2";
import { Tweet } from "./data-types.js";
import { dataUrlToBuffer } from "./data.js";
import { robustPath } from "./util.js";

interface TwitterAuthDetails {
  /* temporary */
  oauthToken?: string;
  oauthTokenSecret?: string;

  /* persistent */
  accessToken?: string;
  accessSecret?: string;
  screenName?: string;
  userId?: string;
}

let appKey: string | null = null;
let appSecret: string | null = null;
let authDetails: TwitterAuthDetails | null = null;

let initPromiseResolver;
let loggedInClient: TwitterApi | null = null;


const initPromise = new Promise(initPromiseResolution => {
  initPromiseResolver = initPromiseResolution;
});

let loginPromiseResolver;
const loginPromise = new Promise(loginResolution => {
  loginPromiseResolver = loginResolution;
});

function loadAuthDetails(): TwitterAuthDetails {
  if (authDetails !== null) {
    return authDetails;
  }
  try {
    const fileContent = readFileSync(robustPath('../auth.json')).toString();
    authDetails = <TwitterAuthDetails>JSON.parse(fileContent);
  } catch (e) {
    authDetails = {}
  }
  return authDetails;
}

function persistAuthDetails() {
  writeFileSync(robustPath('../auth.json'), JSON.stringify(authDetails));
}

function fullyAuthorized(authDetails: TwitterAuthDetails) {
  return authDetails.accessToken && authDetails.accessSecret;
}

export function initTwitterClient(key: string, secret: string): void {
  appKey = key;
  appSecret = secret;

  const authDetails = loadAuthDetails();
  if (fullyAuthorized(authDetails)) {
    console.log('[TW] Fully Authorized already.');
    if (!loggedInClient) {
      console.log('[TW] Still need to login in though.');
      initPromiseResolver();
      loginFullyAuthorized(authDetails);
    }
  }
}

function errorOnUnsetKeyAndSecret() {
  if (!appKey || !appSecret) {
    throw new Error("Please make sure TWITTER_API_KEY and TWITTER_API_SECRET are set in the environment");
  }
}

export async function initializeAuthorization(key: string, secret: string, callbackUrl: string, redirectUrl: string): Promise<string> {
  appKey = key;
  appSecret = secret;
  errorOnUnsetKeyAndSecret();

  const authDetails = loadAuthDetails();
  if (fullyAuthorized(authDetails)) {
    console.log('[TW] Fully Authorized already.');
    if (loggedInClient === null) {
      console.log('[TW] Still need to login in though.');
      initPromiseResolver();
      loginFullyAuthorized(authDetails);
    }
    return redirectUrl;
  }

  console.log('[TW] Instantiate API Object');
  const client = new TwitterApi({appKey, appSecret});
  console.log('[TW] Generate Auth Link');
  console.log('[TW] ' + JSON.stringify({appKey, appSecret, callbackUrl}));
  const authLink = await client.generateAuthLink(callbackUrl); // , { linkMode: 'authorize'}

  authDetails.oauthToken = authLink.oauth_token;
  authDetails.oauthTokenSecret = authLink.oauth_token_secret;
  initPromiseResolver();

  return authLink.url;
}

export async function login(oauthVerifier: string, oauthTokenFromCallback: string) {
  await initPromise;
  const authDetails = loadAuthDetails();
  errorOnUnsetKeyAndSecret();

  console.log(`[TW] oauth_token_from_callback (${oauthTokenFromCallback}) === oauth_token ${authDetails.oauthToken}`);
  console.assert(oauthTokenFromCallback === authDetails.oauthToken);

  console.log(`[TW] oauth_verifier (${oauthVerifier})`);
  const client = new TwitterApi({
    appKey: <string>appKey,
    appSecret: <string>appSecret,
    accessToken: authDetails.oauthToken,
    accessSecret: authDetails.oauthTokenSecret});

  const loginResult = await client.login(oauthVerifier);
  loggedInClient = loginResult.client;

  authDetails.accessToken = loginResult.accessToken;
  authDetails.accessSecret = loginResult.accessSecret;
  authDetails.screenName = loginResult.screenName;
  authDetails.userId = loginResult.userId;

  persistAuthDetails();
  loginPromiseResolver();

  console.log(`[TW] Login completed`);
  return loggedInClient;
}

function loginFullyAuthorized(authDetails: TwitterAuthDetails) {
  errorOnUnsetKeyAndSecret();

  loggedInClient = new TwitterApi({
    appKey: <string>appKey,
    appSecret: <string>appSecret,
    accessToken: authDetails.accessToken,
    accessSecret: authDetails.accessSecret
  });
  loginPromiseResolver();
}


export async function createTweetWithImage(tweet: Tweet): Promise<boolean> {
  if (loggedInClient === null) {
    console.log('[TW] Not logged in, cannot send tweet');
    return false;
  }

  console.log('[TW] Creating Tweet');
  const imageBuffer = dataUrlToBuffer(tweet.image);

  const mediaId = await loggedInClient.v1.uploadMedia(imageBuffer, {type: 'png'});
  await loggedInClient.v1.tweet(tweet.text, {media_ids: [mediaId]});
  console.log('[TW] Tweet Created');
  return true;
}
