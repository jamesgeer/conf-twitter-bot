// Single Tweet
import { Uploads } from '../uploads/uploads';

export interface Tweet {
	id: number;
	accountId: number;
	twitterUserId: bigint;
	createdAt: Date | string;
	updatedAt: Date | string | null;
	dateTime: Date | string;
	content: string;
	sent: boolean;
	uploads?: Uploads;
}

// Tweet sent from frontend and received by backend
export interface HTTPTweet {
	accountId: string;
	twitterUserId?: string;
	dateTime: string;
	content: string;
}

// Array of Tweets
export type Tweets = Array<Tweet>;
