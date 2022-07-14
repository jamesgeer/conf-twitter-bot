/**
 * Model for creating/reading/updating/deleting stored Twitter accounts
 * TODO: Convert from JSON store to DB Object
 */
import loadTwitterAccounts from '../utils/load-accounts';

const twitterAccounts = loadTwitterAccounts();

const accountExists = (): boolean => {
	twitterAccounts.map((account) => {
		console.log(account);
		return true;
	});
	return true;
};

const updateAccount = (): void => {
	console.log('Updated');
};

const insertAccount = (): void => {
	console.log('Added');
};

const insertOrUpdateAccount = (): void => {
	accountExists() ? updateAccount() : insertAccount();
};

const getAccount = (userId: string): any => {};

const getAccounts = (): any => {};

export { accountExists, updateAccount, insertAccount, insertOrUpdateAccount, getAccount, getAccounts };
