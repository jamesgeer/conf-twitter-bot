import { readFileSync } from 'fs';
import path from 'path';
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
		const pathToFile = path.relative(process.cwd(), 'data/twitter-accounts.json');
		const fileContent = readFileSync(pathToFile).toString();
		twitterAccounts = <TwitterAccounts>JSON.parse(fileContent);
	} catch (e) {
		twitterAccounts = { accounts: [] };
	}
	return twitterAccounts;
};

export default loadTwitterAccounts;
