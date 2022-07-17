export interface TwitterAccount {
	userId: string;
	screenName: string;
	profileImageUrl: string;
}

export type TwitterAccounts = Array<TwitterAccount>;
