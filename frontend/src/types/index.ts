export interface TwitterAccount {
	userId: string;
	name: string;
	screenName: string;
	profileImageUrl: string;
}

export interface ActiveTwitterAccountContext {
	activeAccount: TwitterAccount;
	setActiveAccount?: (twitterAccount: TwitterAccount) => void;
	setActiveUser: (twitterAccount: TwitterAccount) => void;
}

export type TwitterAccounts = Array<TwitterAccount>;

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

// Array of Tweets
export type Tweets = Array<Tweet>;

// Tweet sent from frontend and received by backend
export interface HTTPTweet {
	userId: string;
	text: string;
	scheduledTimeUTC?: string;
}
