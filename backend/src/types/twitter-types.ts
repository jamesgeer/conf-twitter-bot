// OAuth 1.0a
interface TwitterOAuth {
	accessToken?: string;
	accessSecret?: string;
}

// User information
interface TwitterUserDetails {
	userId: string;
	screenName: string;
	profileImageUrl?: string;
}

// Object containing credentials and user details
interface TwitterAccount {
	oauth: TwitterOAuth;
	details: TwitterUserDetails;
}

// Array of account objects
type TwitterAccounts = Array<TwitterAccount>;

export { TwitterOAuth, TwitterUserDetails, TwitterAccount, TwitterAccounts };
