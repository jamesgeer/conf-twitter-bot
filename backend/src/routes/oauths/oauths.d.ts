import { TwitterUser } from '../accounts/accounts';

interface TwitterOAuthRequestToken {
	oauthToken?: string;
	oauthTokenSecret: string;
}

export interface TwitterOAuthAccessToken {
	accessToken?: string;
	accessSecret?: string;
}

export interface TwitterOAuthAccount {
	twitterUser: TwitterUser;
	oauth: TwitterOAuthAccessToken;
}
