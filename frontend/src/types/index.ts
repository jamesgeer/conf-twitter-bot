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
// export interface Tweet {
// 	id?: number;
// 	text: string;
// 	image64: string;
// 	paperId: number;
// 	userId?: string;
// 	scheduledTimeUTC?: string;
// 	sent?: boolean;
// }

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
