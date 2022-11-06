import { faker } from '@faker-js/faker';
import HttpStatus from 'http-status';
import prisma from '../../../../lib/prisma';
import { insertUser } from '../../users/users-model';
import { insertTwitterUser } from '../../twitter-users/twitter-users-model';
import { TwitterAccount } from '../../oauths/oauths';
import { Account, TwitterUser } from '../../accounts/accounts';
import {
	deleteTweet,
	getTweet,
	getTweets,
	insertTweet,
	updateTweetContent,
	updateTweetScheduledTime,
	updateTweetSent,
} from '../tweets-model';
import { insertAccount } from '../../accounts/accounts-model';
import { Tweet, Tweets } from '../tweets';
import { ServerError } from '../../types';

const user = {
	id: 0,
	username: faker.internet.userName(),
	password: faker.internet.password(),
};

const twitterAccount: TwitterAccount = {
	userId: '1',
	name: 'Test Twitter User',
	screenName: 'test_twitter_user',
	profileImageUrl: 'image.png',
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

let tweet: Tweet;

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

it('get tweet should return status of not found', async () => {
	const result = <ServerError>await getTweet('1');

	expect(result).toBeInstanceOf(ServerError);
	expect(result.getStatusCode()).toEqual(HttpStatus.NOT_FOUND);
});

it('insert tweet should create one new tweet', async () => {
	const httpTweet = {
		accountId: account.id.toString(),
		twitterUserId: twitterUser.id.toString(),
		scheduledTimeUTC: new Date().toString(),
		content: 'My test tweet',
	};

	tweet = <Tweet>await insertTweet(httpTweet);

	expect(tweet.id).toBeGreaterThan(0);
	expect(tweet).toEqual(
		// tweet without createdDate as createdDate is set by the database
		// so will always be slightly off and so will never pass a test
		expect.objectContaining({
			accountId: +httpTweet.accountId,
			twitterUserId: BigInt(httpTweet.twitterUserId),
			updatedAt: null,
			scheduledTimeUTC: new Date(httpTweet.scheduledTimeUTC),
			content: httpTweet.content,
			sent: false,
		}),
	);
});

it('get tweet should return inserted tweet', async () => {
	const result = <Tweet>await getTweet(tweet.id.toString());

	expect(result.id).toEqual(tweet.id);
	expect(result.content).toEqual(tweet.content);
});

it('get tweets should return an array with one tweet', async () => {
	const result = <Tweets>await getTweets(twitterUser.id.toString());

	expect(result.length).toEqual(1);
	result.map((result: Tweet) => expect(result.id).toEqual(tweet.id));
});

it('get tweets should return error', async () => {
	const result = <ServerError>await getTweets('738');

	expect(result).toBeInstanceOf(ServerError);
	expect(result.getStatusCode()).toEqual(HttpStatus.NOT_FOUND);
});

it('update tweet should update content', async () => {
	const content = 'Meow meow meow';
	const result = await updateTweetContent(tweet.id.toString(), content);

	expect(result).toEqual(
		expect.objectContaining({
			...tweet,
			content,
		}),
	);

	tweet.content = content;
});

describe('update non-existent tweet content should return not found', () => {
	it('content', async () => {
		const result = <ServerError>await updateTweetContent('101', 'I should error');

		expect(result).toBeInstanceOf(ServerError);
		expect(result.getStatusCode()).toEqual(HttpStatus.NOT_FOUND);
	});

	it('dateTime', async () => {
		const result = <ServerError>await updateTweetScheduledTime('101', new Date());

		expect(result).toBeInstanceOf(ServerError);
		expect(result.getStatusCode()).toEqual(HttpStatus.NOT_FOUND);
	});

	it('sent', async () => {
		const result = <ServerError>await updateTweetSent('101', true);

		expect(result).toBeInstanceOf(ServerError);
		expect(result.getStatusCode()).toEqual(HttpStatus.NOT_FOUND);
	});
});

it('get tweet should return tweet with updated content', async () => {
	const result = <Tweet>await getTweet(tweet.id.toString());
	expect(result.id).toEqual(tweet.id);
	expect(result.content).toEqual(tweet.content);
});

it('update tweet should update scheduled datetime', async () => {
	const scheduledTimeUTC = new Date('2022-10-29T21:48:54.738Z');
	const result = await updateTweetScheduledTime(tweet.id.toString(), scheduledTimeUTC);

	expect(result).toEqual(
		expect.objectContaining({
			...tweet,
			scheduledTimeUTC,
		}),
	);

	tweet.scheduledTimeUTC = scheduledTimeUTC;
});

it('get tweet should return tweet with updated scheduled datetime', async () => {
	const result = <Tweet>await getTweet(tweet.id.toString());
	expect(result.id).toEqual(tweet.id);
	expect(result.scheduledTimeUTC).toEqual(tweet.scheduledTimeUTC);
});

it('update tweet should change sent to true', async () => {
	const sent = true;
	const result = await updateTweetSent(tweet.id.toString(), sent);

	expect(result).toEqual(
		expect.objectContaining({
			...tweet,
			sent,
		}),
	);

	tweet.sent = sent;
});

it('get tweet should return tweet with sent true', async () => {
	const result = <Tweet>await getTweet(tweet.id.toString());
	expect(result.id).toEqual(tweet.id);
	expect(result.sent).toEqual(tweet.sent);
});

it('delete tweet should delete tweet with id', async () => {
	const result = <Tweet>await deleteTweet(tweet.id.toString());

	expect(result.id).toEqual(tweet.id);
});

it('get deleted tweet should return status of not found', async () => {
	const result = <ServerError>await getTweet(tweet.id.toString());

	expect(result).toBeInstanceOf(ServerError);
	expect(result.getStatusCode()).toEqual(HttpStatus.NOT_FOUND);
});

it('delete tweet should return status of not found', async () => {
	const result = <ServerError>await deleteTweet('101');

	expect(result).toBeInstanceOf(ServerError);
	expect(result.getStatusCode()).toEqual(HttpStatus.NOT_FOUND);
});
