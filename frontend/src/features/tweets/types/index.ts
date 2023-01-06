export interface Tweet {
	id: number;
	twitterUserId: bigint;
	dateTime: Date | string;
	content: string;
	sent: boolean;
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
