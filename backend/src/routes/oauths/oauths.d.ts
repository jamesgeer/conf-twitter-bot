import { TwitterUser } from '../accounts/accounts';

interface TwitterOAuthRequestToken {
	oauthToken?: string;
	oauthTokenSecret: string;
}

export interface TwitterOAuthAccessToken {
	accessToken?: string;
	accessSecret?: string;
}

export interface TwitterUserOAuth {
	twitterUser: TwitterUser;
	oauth: TwitterOAuthAccessToken;
}

export interface TwitterOAuth {
	id: number;
	accountId: number;
	twitterUserId: bigint;
	accessToken: string;
	accessSecret: string;
	createdAt: Date | string;
	updatedAt?: Date | null;
}
