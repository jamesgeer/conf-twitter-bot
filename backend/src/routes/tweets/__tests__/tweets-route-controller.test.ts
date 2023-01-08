import supertest from 'supertest';
import HttpStatus from 'http-status';
import http from 'http';
import { app } from '../../../app';
import { TestHarness } from '../../../tests/TestHarness';
import { Tweet } from '../tweets';

const request = supertest(http.createServer(app.callback()));

const harness = new TestHarness();

const tweetsEndpoint = '/api/tweets';

let tweetId;

// before any tests are run
beforeAll(async () => {
	await harness.createStandard();
});

// after all tests complete
afterAll(async () => {
	await TestHarness.deleteAll();
});

it('GET tweet should return not found status', async () => {
	const response = await request.get(`${tweetsEndpoint}/${999}`);

	expect(response.status).toEqual(HttpStatus.NOT_FOUND);
});

it('POST tweet should create new tweet and return tweet', async () => {
	const httpTweet = harness.createHttpTweet();

	const response = await request.post(tweetsEndpoint).send(httpTweet);
	expect(response.status).toEqual(HttpStatus.CREATED);

	const createdTweet: Tweet = response.body;
	expect(createdTweet.id).toBeGreaterThan(0);
	expect(createdTweet.content).toEqual(httpTweet.content);

	tweetId = createdTweet.id;
});

it('GET tweet should return tweet for provided id', async () => {
	const response = await request.get(`${tweetsEndpoint}/${tweetId}`);

	expect(response.status).toEqual(HttpStatus.OK);
	expect(response.body.id).toEqual(tweetId);
});

it('GET non-existent tweet should return not found', async () => {
	const response = await request.get(`${tweetsEndpoint}/101`);

	expect(response.status).toEqual(HttpStatus.NOT_FOUND);
});

it('PATCH tweet should update content and return tweet', async () => {
	const response = await request.patch(`${tweetsEndpoint}/${tweetId}`).send({
		content: 'patched content',
	});

	expect(response.status).toEqual(HttpStatus.OK);
	expect(response.body.id).toEqual(tweetId);
	expect(response.body.content).toEqual('patched content');
});

it('GET tweet should return with updated content', async () => {
	const response = await request.get(`${tweetsEndpoint}/${tweetId}`);

	expect(response.status).toEqual(HttpStatus.OK);
	expect(response.body.id).toEqual(tweetId);
	expect(response.body.content).toEqual('patched content');
});

it('PATCH tweet should update content and scheduledTime', async () => {
	const content = 'new content dropped';
	const scheduledTimeUTC = new Date();

	const response = await request.patch(`${tweetsEndpoint}/${tweetId}`).send({
		content,
		scheduledTimeUTC,
	});

	expect(response.status).toEqual(HttpStatus.OK);
	expect(response.body.id).toEqual(tweetId);
	expect(response.body.content).toEqual(content);
	expect(response.body.scheduledTimeUTC).toEqual(scheduledTimeUTC.toISOString());
});

it('PATCH tweet missing expected parameters should return bad request', async () => {
	const response = await request.patch(`${tweetsEndpoint}/${tweetId}`);

	expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
});

it('DELETE tweet should delete tweet', async () => {
	const response = await request.delete(`${tweetsEndpoint}/${tweetId}`);

	expect(response.status).toEqual(HttpStatus.OK);
});

it('GET deleted tweet should return not found status', async () => {
	const response = await request.get(`${tweetsEndpoint}/${tweetId}`);

	expect(response.status).toEqual(HttpStatus.NOT_FOUND);
});

it('DELETE non-existent tweet should return error', async () => {
	const response = await request.delete(`${tweetsEndpoint}/101`);

	expect(response.status).toEqual(HttpStatus.NOT_FOUND);
});
