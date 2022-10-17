import { prismaMock } from '../../../../lib/prismaMock';
import { getAccount, insertAccount } from '../accounts-model';

const account = {
	id: 1,
	userId: 1,
	twitterUserId: BigInt(1),
};

test('should create new account', async () => {
	prismaMock.account.create.mockResolvedValue(account);

	await expect(insertAccount(account.id, account.twitterUserId)).resolves.toEqual(account.id);
});

test('get account should return account', async () => {
	prismaMock.account.findUnique.mockResolvedValue(account);

	await expect(getAccount(account.id.toString())).resolves.toEqual(account);
});
