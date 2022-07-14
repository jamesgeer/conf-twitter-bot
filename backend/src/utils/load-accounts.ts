import { readFileSync } from 'fs';
import { TwitterAccounts } from '../types/twitter-types';

let twitterAccounts: TwitterAccounts | null = null;

/**
 * Temp load from json until database is implemented
 */
const loadTwitterAccounts = (): TwitterAccounts => {
	if (twitterAccounts !== null) {
		return twitterAccounts;
	}
	try {
		const fileContent = readFileSync('./data/twitter-accounts.json').toString();
		twitterAccounts = <TwitterAccounts>JSON.parse(fileContent);
	} catch (e) {
		twitterAccounts = { accounts: [] };
	}
	return twitterAccounts;
};

export default loadTwitterAccounts;
