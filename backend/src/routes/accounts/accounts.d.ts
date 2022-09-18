export interface TwitterUser {
	id: bigint;
	name: string;
	screenName: string;
	profileImageUrl: string;
}

export interface Account {
	id: number;
	userId: number;
	twitterUser: TwitterUser;
}

export type Accounts = Array<Account>;
