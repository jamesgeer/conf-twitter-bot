import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env.development' });

// import values from .env file, if value is missing for whatever reason then use fallback value
// https://wesbos.com/destructuring-default-values
export const { TWITTER_API_KEY = '', TWITTER_API_SECRET = '', DEV = true, PORT = 4000 } = process.env;
