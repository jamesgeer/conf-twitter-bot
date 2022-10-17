import HttpStatus from 'http-status';
import { prismaMock } from '../../../../lib/prismaMock';
import { accountExists, deleteAccount, getAccount, getAccounts, insertAccount } from '../accounts-model';
import { ServerError } from '../../types';

const account = {
	id: 1,
	userId: 1,
	twitterUserId: BigInt(1),
};

test('should create new account', async () => {
	prismaMock.account.create.mockResolvedValue(account);

	await expect(insertAccount(account.id, account.twitterUserId)).resolves.toEqual(account.id);
});

test('create account should return account already exists error', async () => {
	// set count to one so prisma thinks account already exists
	prismaMock.account.count.mockResolvedValue(1);

	await expect(insertAccount(account.id, account.twitterUserId)).resolves.toEqual(
		new ServerError(HttpStatus.CONFLICT, 'Account already exists.'),
	);
});

test('get account should return account', async () => {
	prismaMock.account.findUnique.mockResolvedValue(account);

	await expect(getAccount(account.id.toString())).resolves.toEqual(account);
});

test('get account should return null', async () => {
	prismaMock.account.findUnique.mockResolvedValue(null);

	await expect(getAccount('2')).resolves.toEqual(null);
});

test('get accounts should return array of accounts', async () => {
	prismaMock.account.findMany.mockResolvedValue([account]);

	await expect(getAccounts(account.userId)).resolves.toEqual([account]);
});

test('get accounts should return empty array', async () => {
	prismaMock.account.findMany.mockResolvedValue([]);

	await expect(getAccounts(account.userId)).resolves.toEqual([]);
});

test('account exists should return true', async () => {
	// prisma count set to one so account exists
	prismaMock.account.count.mockResolvedValue(1);

	await expect(accountExists(account.userId, account.twitterUserId)).resolves.toEqual(true);
});

test('account exists should return false', async () => {
	// prisma count 0 so account does not exist
	prismaMock.account.count.mockResolvedValue(0);

	await expect(accountExists(account.userId, account.twitterUserId)).resolves.toEqual(false);
});

test('deleting account should return true', async () => {
	prismaMock.account.delete.mockResolvedValue(account);

	await expect(deleteAccount(account.id.toString())).resolves.toEqual(true);
});

test('deleting account that does not exist should return 404 error', async () => {
	prismaMock.account.findUnique.mockResolvedValue(null);

	await expect(deleteAccount(account.id.toString())).resolves.toEqual(
		new ServerError(HttpStatus.NOT_FOUND, 'Account does not exist.'),
	);
});
