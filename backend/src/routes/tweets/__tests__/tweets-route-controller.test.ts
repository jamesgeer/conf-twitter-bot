import supertest from 'supertest';
import HttpStatus from 'http-status';
import http from 'http';
import { faker } from '@faker-js/faker';
import { app } from '../../../app';
import { TwitterAccount } from '../../oauths/oauths';
import { Account, TwitterUser } from '../../accounts/accounts';
import { insertUser } from '../../users/users-model';
import { insertTwitterUser } from '../../twitter-users/twitter-users-model';
import { insertAccount } from '../../accounts/accounts-model';
import prisma from '../../../../lib/prisma';

const request = supertest(http.createServer(app.callback()));

const user = {
	id: 0,
	username: faker.internet.userName(),
	password: faker.internet.password(),
};

const twitterAccount: TwitterAccount = {
	userId: user.id.toString(),
	name: faker.internet.userName().replace('_', ' '),
	screenName: faker.internet.userName(),
	profileImageUrl: faker.internet.avatar(),
	oauth: {},
};

const twitterUser: TwitterUser = {
	id: BigInt(0),
	name: twitterAccount.name,
	screenName: twitterAccount.screenName,
	profileImageUrl: twitterAccount.profileImageUrl,
};

const account: Account = {
	id: 0,
	userId: user.id,
	twitterUser,
};

const tweetsEndpoint = '/api/tweets';

let tweetId;

// before any tests are run
beforeAll(async () => {
	const userId = <number>await insertUser(user.username, user.password);

	user.id = userId;
	twitterAccount.userId = userId.toString();

	twitterUser.id = <bigint>await insertTwitterUser(twitterAccount);
	account.id = <number>await insertAccount(user.id, twitterUser.id);
});

// after all tests complete
afterAll(async () => {
	await prisma.tweet.deleteMany({});
	await prisma.account.deleteMany({});
	await prisma.twitterUser.deleteMany({});
	await prisma.user.deleteMany({});
	await prisma.$disconnect();
});

it('GET tweet should return not found status', async () => {
	const response = await request.get(`${tweetsEndpoint}/1`);

	expect(response.status).toEqual(HttpStatus.NOT_FOUND);
});

it('POST tweet should create new tweet and return id', async () => {
	const httpTweet = {
		accountId: account.id.toString(),
		twitterUserId: twitterUser.id.toString(),
		scheduledTimeUTC: new Date().toString(),
		content: 'My test tweet',
	};

	const response = await request.post(tweetsEndpoint).send(httpTweet);
	expect(response.status).toEqual(HttpStatus.CREATED);
	expect(response.body).toBeGreaterThan(0);

	tweetId = response.body;
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
