import { LoginResult, TwitterApi } from "twitter-api-v2";
import { dataUrlToBuffer, Tweet } from "./data.js";

let appKey;
let appSecret;
let oauth_token;
let oauth_token_secret;


let initPromiseResolver;
let loggedInClient: LoginResult;


const initPromise = new Promise(initPromiseResolution => {
  initPromiseResolver = initPromiseResolution;
});

let loginPromiseResolver;
const loginPromise = new Promise(loginResolution => {
  loginPromiseResolver = loginResolution;
});

export async function initializeAuthorization(key: string, secret: string, callbackUrl: string): Promise<string> {
  if (!key || !secret) {
    throw new Error("Please make sure TWITTER_API_KEY and TWITTER_API_SECRET are set in the environment");
  }
  appKey = key;
  appSecret = secret;

  console.log('[TW] Instantiate API Object');
  const client = new TwitterApi({appKey, appSecret});
  console.log('[TW] Generate Auth Link');
  console.log('[TW] ' + JSON.stringify({appKey, appSecret, callbackUrl}));
  const authLink = await client.generateAuthLink(
    callbackUrl); // , { linkMode: 'authorize'}

  oauth_token = authLink.oauth_token;
  oauth_token_secret = authLink.oauth_token_secret;
  initPromiseResolver(authLink);

  return authLink.url;
}

export async function login(oauth_verifier: string, oauth_token_from_callback: string) {
  await initPromise;
  console.log(`[TW] oauth_token_from_callback (${oauth_token_from_callback}) === oauth_token ${oauth_token}`);
  console.assert(oauth_token_from_callback === oauth_token);

  console.log(`[TW] oauth_verifier (${oauth_verifier})`);
  const client = new TwitterApi({appKey, appSecret,
    accessToken: oauth_token,
    accessSecret: oauth_token_secret});
  loggedInClient = await client.login(oauth_verifier);
  loginPromiseResolver(loggedInClient);

  console.log(`[TW] Login completed`);
  return loggedInClient;
}


export async function createTweetWithImage(tweet: Tweet) {
  await loginPromise;
  const imageBuffer = dataUrlToBuffer(tweet.image);

  const mediaId = await loggedInClient.client.v1.uploadMedia(imageBuffer, {type: 'png'});
  await loggedInClient.client.v1.tweet(tweet.text, {media_ids: [mediaId]});
}
