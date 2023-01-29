import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

// import values from .env file, if value is missing for whatever reason then use fallback value
// https://wesbos.com/destructuring-default-values
export const {
	DEV = true,
	PORT = 4000,
	APP_URL = 'http://localhost:3000',
	TEST = false,
	TWITTER_API_KEY = '',
	TWITTER_API_SECRET = '',
	TWITTER_CALLBACK_URL = `${APP_URL}/twitter-oauth-callback`,
} = process.env;
