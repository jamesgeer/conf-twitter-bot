import HttpStatus from 'http-status';
import { TestHarness } from '../../../tests/TestHarness';
import { Account, TwitterUser } from '../../accounts/accounts';
import { insertTwitterOAuth } from '../oauths-model';
import { TwitterOAuth } from '../oauths';
import { ServerError } from '../../types';

const harness = new TestHarness();

let account: Account;
let twitterUser: TwitterUser;

// before any tests are run
beforeAll(async () => {
	await harness.createStandard();
	account = harness.getAccount();
	twitterUser = harness.getTwitterUser();
});

// after all tests complete
afterAll(async () => {
	await TestHarness.deleteAll();
});

it('test harness correctly created relations', async () => {
	expect(account.id).toBeGreaterThan(0);
	expect(twitterUser.id).toBeGreaterThan(0);
});

it('insert twitter oauth should return twitter oauth for account and twitter user', async () => {
	const result = <TwitterOAuth>await insertTwitterOAuth(account.id, twitterUser.id, 'token', 'secret');

	expect(result.id).toBeGreaterThan(0);
	expect(result).toEqual(
		expect.objectContaining({
			id: expect.any(Number),
			accountId: account.id,
			twitterUserId: twitterUser.id,
			accessToken: 'token',
			accessSecret: 'secret',
			createdAt: expect.any(Date),
			updatedAt: null,
		}),
	);
});

it('inserting an oauth for the same twitter user id and account id should return server error', async () => {
	const result = <ServerError>await insertTwitterOAuth(account.id, twitterUser.id, 'token', 'secret');

	expect(result).toBeInstanceOf(ServerError);
	expect(result.getStatusCode()).toEqual(HttpStatus.CONFLICT);
});

it('inserting same twitter user id but with a different account id should return twitter oauth', async () => {
	const newHarness = new TestHarness();
	await newHarness.createStandard();
	const newAccount = harness.getAccount();

	const result = <TwitterOAuth>await insertTwitterOAuth(newAccount.id, twitterUser.id, 'token', 'secret');

	expect(result.id).toBeGreaterThan(0);
	expect(result).toEqual(
		expect.objectContaining({
			id: expect.any(Number),
			accountId: newAccount.id,
			twitterUserId: twitterUser.id,
			accessToken: 'token',
			accessSecret: 'secret',
			createdAt: expect.any(Date),
			updatedAt: null,
		}),
	);
});
