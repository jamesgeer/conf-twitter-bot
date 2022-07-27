// Temporary credentials
export interface TwitterOAuthRequestToken {
	oauthToken?: string;
	oauthTokenSecret: string;
}

// Token credentials
export interface TwitterOAuthAccessToken {
	accessToken?: string;
	accessSecret?: string;
}

// Object containing credentials and user details
export interface TwitterAccount {
	userId: string;
	name: string;
	screenName: string;
	profileImageUrl: string;
	oauth: TwitterOAuthAccessToken;
}

// Array of account objects
export type TwitterAccounts = Array<TwitterAccount>;

// Just an error type
export interface TwitterError {
	error: boolean;
	message: string;
}

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
