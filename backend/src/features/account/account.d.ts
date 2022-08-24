// Object containing credentials and user details
import { TwitterOAuthAccessToken } from '../../types/twitter-types';

export interface TwitterAccount {
	userId: string;
	name: string;
	screenName: string;
	profileImageUrl: string;
	oauth: TwitterOAuthAccessToken;
}

// Array of account objects
export type TwitterAccounts = Array<TwitterAccount>;
