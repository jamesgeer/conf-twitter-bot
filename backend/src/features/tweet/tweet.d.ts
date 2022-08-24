// Single Tweet
export interface Tweet {
	id?: number;
	text: string;
	image64: string;
	paperId: number;
	userId?: string;
	scheduledTimeUTC?: string;
	sent?: boolean;
}

// Tweet sent from frontend and received by backend
export interface HTTPTweet {
	userId: string;
	text: string;
	scheduledTimeUTC?: string;
}

// Array of Tweets
export type Tweets = Array<Tweet>;
