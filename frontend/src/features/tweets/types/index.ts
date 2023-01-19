import { Uploads } from '../../uploads/types';

export interface Tweet {
	id: number;
	accountId: number;
	twitterUserId: bigint;
	createdAt?: Date | string;
	updatedAt?: Date | string | null;
	dateTime: Date | string;
	content: string;
	sent: boolean;
	uploads?: Uploads;
}

export interface HTTPTweet {
	tweetId?: number;
	accountId: number;
	twitterUserId: bigint;
	dateTime: Date | string;
	content: string;
}

// Array of Tweets
export type Tweets = Array<Tweet>;
