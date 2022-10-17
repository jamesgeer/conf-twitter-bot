import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env.development' });

export const { TWITTER_API_KEY, TWITTER_API_SECRET, DEV, PORT } = process.env;
