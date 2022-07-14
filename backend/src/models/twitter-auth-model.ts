/**
 * Model for creating/reading/updating/deleting stored Twitter accounts
 * TODO: Convert from JSON store to DB Object
 */
import { TwitterAccounts } from '../types/twitter-types';

const twitterAccounts: TwitterAccounts | null = null;

const accountExists = (): boolean => true;

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
