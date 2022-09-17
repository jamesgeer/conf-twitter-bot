// Single Tweet
export interface OldTweet {
	id?: number;
	text: string;
	image64: string;
	paperId: number;
	userId?: string;
	scheduledTimeUTC?: string;
	sent?: boolean;
}

export interface Tweet {
	id: number;
	twitterUserId: string;
	scheduledTimeUTC: string;
	content: string;
	sent: boolean;
}

// Tweet sent from frontend and received by backend
export interface HTTPTweet {
	accountId: string;
	twitterUserId: string;
	scheduledTimeUTC?: string;
	content: string;
}

// Array of Tweets
export type Tweets = Array<Tweet>;
