export interface Tweet {
	id: number;
	twitterUserId: bigint;
	scheduledTimeUTC: Date | string;
	content: string;
	sent: boolean;
}

// Array of Tweets
export type Tweets = Array<Tweet>;
