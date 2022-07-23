export interface TwitterAccount {
	userId: string;
	name: string;
	screenName: string;
	profileImageUrl: string;
}

export interface ActiveTwitterAccountContext {
	activeAccount: TwitterAccount;
	setActiveAccount?: (twitterAccount: TwitterAccount) => void;
	setActiveUser: (twitterAccount: TwitterAccount) => void;
}

export type TwitterAccounts = Array<TwitterAccount>;
