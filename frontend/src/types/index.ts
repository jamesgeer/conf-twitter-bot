export interface Tweet {
	id: number;
	twitterUserId: bigint;
	scheduledTimeUTC: Date | string;
	content: string;
	sent: boolean;
}

// Array of Tweets
export type Tweets = Array<Tweet>;

// Tweet sent from frontend and received by backend
export interface HTTPTweet {
	userId: string;
	text: string;
	scheduledTimeUTC?: string;
}

export interface Paper {
	type: string;
	title: string;
	authors: string[];
	fullAuthors?: string;

	doi?: string;
	url?: string;
	preprint?: string;

	shortAbstract?: string;
	fullAbstract?: string;

	monthYear?: string;
	pages?: string;

	citations?: number;
	downloads?: number;

	id?: number;
	proceedingsId?: number;
}

export type Papers = Array<Paper>;
