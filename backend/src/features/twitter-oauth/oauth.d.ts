interface TwitterOAuthRequestToken {
	oauthToken?: string;
	oauthTokenSecret: string;
}

export interface TwitterOAuthAccessToken {
	accessToken?: string;
	accessSecret?: string;
}

export interface TwitterAccount {
	userId: string;
	name: string;
	screenName: string;
	profileImageUrl: string;
	oauth: TwitterOAuthAccessToken;
}

export type TwitterAccounts = Array<TwitterAccount>;

export interface TwitterError {
	error: boolean;
	message: string;
}
