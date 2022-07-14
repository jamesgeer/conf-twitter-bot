// Authentication details, that are persisted.
interface TwitterAccount {
	screenName: string;
	userId: string;
	profileImageUrl?: string;
}

// Authentication details, used during the login/authentication process.
interface TwitterTempAuth {
	oauthToken?: string;
	oauthTokenSecret?: string;
}

// Stored authentication details
interface TwitterAuthDetails {
	accessToken?: string;
	accessSecret?: string;
	account: TwitterAccount;
}

// Accounts loaded into memory from 'twitter-accounts.json'
interface TwitterAccounts {
	accounts: TwitterAuthDetails[];
}

export { TwitterAccount, TwitterAccounts, TwitterTempAuth, TwitterAuthDetails };
