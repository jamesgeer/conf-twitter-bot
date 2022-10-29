import HttpStatus from 'http-status';
import { prismaMock } from '../../../../lib/prismaMock';
import { deleteTweet, insertTweet, updateTweetContent, updateTweetScheduledTime } from '../tweets-model';
import { HTTPTweet, Tweet } from '../tweets';
import { ServerError } from '../../types';

const newTweet: HTTPTweet = {
	accountId: '1',
	twitterUserId: BigInt(1).toString(),
	scheduledTimeUTC: new Date().toISOString(),
	content: 'My test tweet',
};

const tweet: Tweet = {
	id: 1,
	accountId: +newTweet.accountId,
	twitterUserId: BigInt(newTweet.twitterUserId),
	createdAt: new Date(),
	updatedAt: null,
	// @ts-ignore
	scheduledTimeUTC: newTweet.scheduledTimeUTC,
	content: 'Some new content',
	sent: false,
};

test('should insert new tweet', async () => {
	const expectedTweet: Tweet = {
		id: 1,
		accountId: +newTweet.accountId,
		twitterUserId: BigInt(newTweet.twitterUserId),
		createdAt: new Date(),
		updatedAt: null,
		// @ts-ignore
		scheduledTimeUTC: newTweet.scheduledTimeUTC,
		content: newTweet.content,
		sent: false,
	};

	// prisma keeps saying "date" is a string, must be a bug as I'm clearly doing "new Date():
	// @ts-ignore
	prismaMock.tweet.create.mockResolvedValue(expectedTweet);
	await expect(insertTweet(newTweet)).resolves.toEqual(expectedTweet);
});

test('insert tweet should return unauthorised error', async () => {
	const newTweet: HTTPTweet = {
		accountId: '',
		twitterUserId: '',
		scheduledTimeUTC: '',
		content: '',
	};

	await expect(insertTweet(newTweet)).resolves.toEqual(
		new ServerError(HttpStatus.UNAUTHORIZED, 'Tweet missing required fields.'),
	);
});

test('should update tweet content', async () => {
	// @ts-ignore
	prismaMock.tweet.update.mockResolvedValue(tweet);

	await expect(updateTweetContent(tweet.id, tweet.content)).resolves.toEqual(tweet);
});

test('should update tweet scheduled datetime', async () => {
	tweet.scheduledTimeUTC = '2022-10-29T21:48:54.738Z';

	// @ts-ignore
	prismaMock.tweet.update.mockResolvedValue(tweet);

	await expect(updateTweetScheduledTime(tweet.id, tweet.scheduledTimeUTC)).resolves.toEqual(tweet);
});

test('delete tweet should return true', async () => {
	// @ts-ignore
	prismaMock.tweet.delete.mockResolvedValue(true);

	await expect(deleteTweet(1)).resolves.toEqual(true);
});
