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
	name: string;
	screenName: string;
	profileImageUrl: string;
	oauth: TwitterOAuthAccessToken;
}

interface TwitterError {
	error: boolean;
	message: string;
}

// Array of account objects
type TwitterAccounts = Array<TwitterAccount>;

export { TwitterOAuthRequestToken, TwitterAccount, TwitterAccounts, TwitterError };
