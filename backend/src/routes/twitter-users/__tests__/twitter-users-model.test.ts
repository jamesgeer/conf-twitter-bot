import HttpStatus from 'http-status';
import { getTwitterUser, insertTwitterUser, twitterUserExists } from '../twitter-users-model';
import { TwitterUser } from '../../accounts/accounts';
import { TestHarness } from '../../../tests/TestHarness';
import { ServerError, User } from '../../types';

const harness = new TestHarness();

let user: User;
let twitterUser: TwitterUser;

beforeAll(async () => {
	user = await harness.createUser();
});

// after all tests complete
afterAll(async () => {
	await TestHarness.deleteAll();
});

describe('create and check twitter user', () => {
	it('insert twitter user should create and return a twitter user', async () => {
		const newTwitterUser = harness.generateTwitterUser();
		const result = <TwitterUser>await insertTwitterUser(user.id, newTwitterUser);

		expect(result).toEqual(newTwitterUser);
		twitterUser = result;
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
	it('insert existing twitter user for account should return conflict error', async () => {
		await harness.createAccount(user, twitterUser);
		const result = <ServerError>await insertTwitterUser(user.id, twitterUser);

		expect(result).toBeInstanceOf(ServerError);
		expect(result.getStatusCode()).toEqual(HttpStatus.CONFLICT);
	});

	it('insert existing twitter user for new user should return twitter user', async () => {
		const newHarness = new TestHarness();
		const newUser = await newHarness.createUser();
		const result = <TwitterUser>await insertTwitterUser(newUser.id, twitterUser);

		expect(result).toEqual(twitterUser);
	});
});
