/**
 * Model for creating/reading/updating/deleting stored Twitter accounts
 * TODO: Convert from JSON store to DB Object
 */
import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { TwitterAccount, TwitterAccounts } from '../types/twitter-types';

let twitterAccounts: TwitterAccounts;
const pathToFile = path.relative(process.cwd(), 'data/twitter-accounts.json');

const getAccounts = (): TwitterAccounts => {
	try {
		const fileContent = readFileSync(pathToFile).toString();
		twitterAccounts = <TwitterAccounts>JSON.parse(fileContent);
	} catch (e) {
		console.error(e);
		twitterAccounts = [];
	}
	return twitterAccounts;
};

const getAccount = (userId: string): TwitterAccount => {
	twitterAccounts = getAccounts();
	return twitterAccounts.find((account) => account.userId === userId);
};

const accountExists = (userId: string): boolean => {
	twitterAccounts = getAccounts();
	return twitterAccounts.some((account) => account.userId === userId);
};

const updateAccount = (): void => {
	console.error('UPDATE NOT IMPLEMENTED');
};

const insertAccount = (twitterAccount: TwitterAccount): void => {
	twitterAccounts.push(twitterAccount);
	writeFileSync(pathToFile, JSON.stringify(twitterAccounts));
};

// eslint-disable-next-line
const insertOrUpdateAccount = (twitterAccount: TwitterAccount): void =>
	accountExists(twitterAccount.userId) ? updateAccount() : insertAccount(twitterAccount);

export { updateAccount, insertAccount, insertOrUpdateAccount, getAccount, getAccounts };
