export interface TwitterAccount {
	userId: string;
	name: string;
	screenName: string;
	profileImageUrl: string;
}

export type TwitterAccounts = Array<TwitterAccount>;
