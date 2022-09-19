/**
 * Model for creating/reading/updating/deleting stored Twitter accounts
 * TODO: Convert from JSON store to DB Object
 */
import prisma from '../../../lib/prisma';
import { Accounts } from './accounts';

export const getAccounts = async (userId: number): Promise<Accounts> =>
	prisma.account.findMany({
		where: {
			userId,
		},
		select: {
			id: true,
			userId: true,
			twitterUser: {
				select: {
					id: true,
					name: true,
					screenName: true,
					profileImageUrl: true,
				},
			},
		},
	});

// export const getAccount = (userId: string): TwitterAccount => {
// 	twitterAccounts = getAccounts();
// 	return twitterAccounts.find((account) => account.userId === userId);
// };

export const accountExists = async (accountId: number, userId: number): Promise<boolean> => {
	const result = await prisma.account.count({
		where: {
			id: accountId,
			userId,
		},
	});

	return result > 0;
};

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
