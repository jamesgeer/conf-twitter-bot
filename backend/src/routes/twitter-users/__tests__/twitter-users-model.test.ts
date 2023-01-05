import HttpStatus from 'http-status';
import { deleteTwitterUser, getTwitterUser, insertTwitterUser, twitterUserExists } from '../twitter-users-model';
import { TwitterUser } from '../../accounts/accounts';
import { TestHarness } from '../../../tests/TestHarness';
import { ServerError } from '../../types';
import { accountExists } from '../../accounts/accounts-model';

const harness = new TestHarness();

beforeAll(async () => {
	await harness.createStandard();
});

// after all tests complete
afterAll(async () => {
	await TestHarness.deleteAll();
});

const user = harness.getUser();
const twitterUser = harness.getTwitterUser();
const twitterAccount = harness.getAccount();
console.log('===JAMES');
console.log(twitterAccount);
console.log('END==');

describe('create and check twitter user', () => {
	it('insert twitter user should create and return a twitter user', async () => {
		const result = <TwitterUser>await insertTwitterUser(user.id, twitterUser);

		expect(result).toEqual(twitterUser);
	});

	it('get twitter user should return twitter user', async () => {
		const result = <TwitterUser>await getTwitterUser(twitterUser.id);

		expect(result).toEqual(twitterUser);
	});

	it('check twitter user exists should return true', async () => {
		const result = await twitterUserExists(twitterUser.id);

		expect(result).toBe(true);
	});

	it('check twitter user exists should return false', async () => {
		const result = await twitterUserExists(BigInt(999));

		expect(result).toBe(false);
	});

	it('get twitter user should return not found error', async () => {
		const result = <ServerError>await getTwitterUser(BigInt(999));

		expect(result).toBeInstanceOf(ServerError);
		expect(result.getStatusCode()).toEqual(HttpStatus.NOT_FOUND);
	});
});

describe('twitter user conflict tests', () => {
	it('account should exist for this user', async () => {
		const result = await accountExists(user.id, twitterUser.id);

		expect(result).toBe(true);
	});

	it('twitter user should exist for this user', async () => {
		const result = <TwitterUser>await insertTwitterUser(user.id, twitterUser);

		expect(result).toEqual(twitterUser);
	});

	it('insert existing twitter user for account should return conflict error', async () => {
		const result = <ServerError>await insertTwitterUser(user.id, twitterUser);

		expect(result).toBeInstanceOf(ServerError);
		expect(result.getStatusCode()).toEqual(HttpStatus.CONFLICT);
	});
});

describe('delete twitter user', () => {
	it('delete twitter user should return deleted twitter user', async () => {
		const result = await deleteTwitterUser(twitterUser.id);

		expect(result).toEqual(twitterUser);
	});

	it('check deleted twitter user exists should return false', async () => {
		const result = await twitterUserExists(twitterUser.id);

		expect(result).toBe(false);
	});

	it('get deleted twitter user should return not found error', async () => {
		const result = <ServerError>await getTwitterUser(twitterUser.id);

		expect(result).toBeInstanceOf(ServerError);
		expect(result.getStatusCode()).toEqual(HttpStatus.NOT_FOUND);
	});
});
