// Temporary credentials
interface TwitterOAuthRequestToken {
	oauthToken?: string;
	oauthTokenSecret: string;
}

// Token credentials
interface TwitterOAuthAccessToken {
	accessToken?: string;
	accessSecret?: string;
}

// Object containing credentials and user details
interface TwitterAccount {
	userId: string;
	screenName: string;
	profileImageUrl?: string;
	oauth: TwitterOAuthAccessToken;
}

// Array of account objects
type TwitterAccounts = Array<TwitterAccount>;

export { TwitterOAuthRequestToken, TwitterAccount, TwitterAccounts };
