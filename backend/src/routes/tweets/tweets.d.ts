// Single Tweet
export interface Tweet {
	id: number;
	accountId: number;
	twitterUserId: bigint;
	createdAt: Date | string;
	updatedAt: Date | string | null;
	scheduledTimeUTC: Date | string;
	content: string;
	sent: boolean;
}

// Tweet sent from frontend and received by backend
export interface HTTPTweet {
	accountId: string;
	twitterUserId: string;
	dateTime?: string;
	content: string;
	image?: File;
}

// Array of Tweets
export type Tweets = Array<Tweet>;
