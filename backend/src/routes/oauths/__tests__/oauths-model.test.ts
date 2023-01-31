import HttpStatus from 'http-status';
import { TestHarness } from '../../../tests/TestHarness';
import { TwitterUser } from '../../accounts/accounts';
import { getTwitterUserOAuth, insertTwitterOAuth } from '../oauths-model';
import { TwitterOAuth } from '../oauths';
import { ServerError } from '../../types';

const harness = new TestHarness();

let twitterUser: TwitterUser;

// before any tests are run
beforeAll(async () => {
	await harness.createStandard();
	twitterUser = harness.getTwitterUser();
});

// after all tests complete
afterAll(async () => {
	await TestHarness.deleteAll();
});

it('test harness correctly created relations', async () => {
	expect(twitterUser.id).toBeGreaterThan(0);
});

it('insert twitter oauth should return twitter oauth for twitter user', async () => {
	const result = <TwitterOAuth>await insertTwitterOAuth(twitterUser.id, 'token', 'secret');

	expect(result.id).toBeGreaterThan(0);
	expect(result).toEqual(
		expect.objectContaining({
			id: expect.any(Number),
			twitterUserId: twitterUser.id,
			accessToken: 'token',
			accessSecret: 'secret',
			createdAt: expect.any(Date),
			updatedAt: expect.any(Date),
		}),
	);
});

it('inserting an oauth for the same twitter user should return server error', async () => {
	const result = <ServerError>await insertTwitterOAuth(twitterUser.id, 'token', 'secret');

	expect(result).toBeInstanceOf(ServerError);
	expect(result.getStatusCode()).toEqual(HttpStatus.CONFLICT);
});

it('get existing oauth should return oauth', async () => {
	const result = <TwitterOAuth>await getTwitterUserOAuth(twitterUser.id);

	expect(result.id).toBeGreaterThan(0);
	expect(result).toEqual(
		expect.objectContaining({
			id: expect.any(Number),
			twitterUserId: twitterUser.id,
			accessToken: 'token',
			accessSecret: 'secret',
			createdAt: expect.any(Date),
			updatedAt: expect.any(Date),
		}),
	);
});

it('get non-existing oauth should return server error', async () => {
	const result = <ServerError>await getTwitterUserOAuth(BigInt(999));

	expect(result.getStatusCode()).toEqual(HttpStatus.NOT_FOUND);
});
