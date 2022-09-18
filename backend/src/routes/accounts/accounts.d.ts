export interface TwitterUser {
	name: string;
	screenName: string;
	profileImageUrl: string;
}

export interface Account {
	accountId: number;
	userId: number;
	twitterUserId: bigint;
	twitterUser: TwitterUser;
}

export type Accounts = Array<Account>;
