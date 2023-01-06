import supertest from 'supertest';
import HttpStatus from 'http-status';
import http from 'http';
import { app } from '../../../app';
import { TestHarness } from '../../../tests/TestHarness';
import { TwitterUser } from '../../accounts/accounts';

const request = supertest(http.createServer(app.callback()));

const harness = new TestHarness();

const twitterUsersEndpoint = '/api/twitter-users';

// before any tests are run
beforeAll(async () => {
	await harness.createStandard();
});

// after all tests complete
afterAll(async () => {
	await TestHarness.deleteAll();
});

it('GET twitter-user should return twitter-user', async () => {
	const response = await request.get(`${twitterUsersEndpoint}/${harness.getTwitterUser().id}`);

	expect(response.status).toEqual(HttpStatus.OK);

	const twitterUser = response.body as TwitterUser;
	twitterUser.id = BigInt(twitterUser.id);
	expect(twitterUser).toEqual(harness.getTwitterUser());
});

it('GET twitter-user should return bad request error', async () => {
	const response = await request.get(`${twitterUsersEndpoint}/${0}`);

	expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
});

it('GET twitter-user should return not found error', async () => {
	const response = await request.get(`${twitterUsersEndpoint}/${999}`);

	expect(response.status).toEqual(HttpStatus.NOT_FOUND);
});
