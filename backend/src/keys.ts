import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

// JavaScript equivalent of an enum for the node environment options
export const NODE_ENV_OPTIONS = { DEV: 'DEV', TEST: 'TEST', PRODUCTION: 'PRODUCTION' };

// import values from .env file, if value is missing for whatever reason then use fallback value
// https://wesbos.com/destructuring-default-values
export const {
	NODE_ENV = NODE_ENV_OPTIONS.DEV,
	PORT = 4000,
	APP_URL = 'http://localhost:3000',
	TWITTER_API_KEY = '',
	TWITTER_API_SECRET = '',
	OPENAI_SECRET = '',
	TWITTER_CALLBACK_URL = `${APP_URL}/twitter-oauth-callback`,
} = process.env;
