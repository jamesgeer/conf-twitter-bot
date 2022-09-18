/**
 * Model for creating/reading/updating/deleting stored Twitter accounts
 * TODO: Convert from JSON store to DB Object
 */
import prisma from '../../../lib/prisma';
import { Accounts } from './accounts';

export const getAccounts = async (userId: string): Promise<Accounts> =>
	prisma.account.findMany({
		where: {
			userId: +userId,
		},
	});

// export const getAccount = (userId: string): TwitterAccount => {
// 	twitterAccounts = getAccounts();
// 	return twitterAccounts.find((account) => account.userId === userId);
// };
//
// export const accountExists = (userId: string): boolean => {
// 	twitterAccounts = getAccounts();
// 	return twitterAccounts.some((account) => account.userId === userId);
// };
//
// export const updateAccount = (): boolean => {
// 	console.error('UPDATE NOT IMPLEMENTED');
// 	return false;
// };
//
// export const insertAccount = (twitterAccount: TwitterAccount): boolean => {
// 	twitterAccounts.push(twitterAccount);
// 	try {
// 		writeFileSync(pathToFile, JSON.stringify(twitterAccounts));
// 		return true;
// 	} catch (e) {
// 		console.log(e);
// 		return false;
// 	}
// };
//
// // eslint-disable-next-line
// export const insertOrUpdateAccount = (twitterAccount: TwitterAccount): boolean => {
// 	return accountExists(twitterAccount.userId) ? updateAccount() : insertAccount(twitterAccount);
// };
