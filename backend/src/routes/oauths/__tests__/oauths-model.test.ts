import { TestHarness } from '../../../tests/TestHarness';
import { Account, TwitterUser } from '../../accounts/accounts';
import { insertTwitterOAuth } from '../oauths-model';
import { TwitterOAuth } from '../oauths';

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

it('insertTwitterOAuth should return twitter oauth for account and twitter user', async () => {
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
