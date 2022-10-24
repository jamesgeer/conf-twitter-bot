import HttpStatus from 'http-status';
import { prismaMock } from '../../../../lib/prismaMock';
import { deleteTweet, insertTweet, updateTweet } from '../tweets-model';
import { HTTPTweet, Tweet } from '../tweets';
import { ServerError } from '../../types';

const tweet = {
	id: 1,
	accountId: 1,
	twitterUserId: BigInt(1),
	scheduledTimeUTC: new Date().toUTCString(),
	content: 'My test tweet',
	sent: false,
};

test('should insert new tweet', async () => {
	// prisma keeps saying "date" is a string, must be a bug as I'm clearly doing "new Date():
	// @ts-ignore
	prismaMock.tweet.create.mockResolvedValue(tweet);

	const newTweet: HTTPTweet = {
		accountId: '1',
		twitterUserId: tweet.twitterUserId.toString(),
		scheduledTimeUTC: tweet.scheduledTimeUTC.toString(),
		content: tweet.content,
	};

	await expect(insertTweet(newTweet)).resolves.toEqual(true);
});

test('insert tweet should return unauthorised error', async () => {
	// prisma keeps saying "date" is a string, must be a bug as I'm clearly doing "new Date():
	// @ts-ignore
	prismaMock.tweet.create.mockResolvedValue(tweet);

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

test('update tweet should return newly updated tweet', async () => {
	const updatedTweet: Tweet = {
		id: 1,
		twitterUserId: BigInt(1),
		scheduledTimeUTC: new Date().toUTCString(),
		content: 'Blah blah blah',
		sent: false,
	};

	// @ts-ignore
	prismaMock.tweet.update.mockResolvedValue(updatedTweet);

	await expect(updateTweet(updatedTweet)).resolves.toEqual(updatedTweet);
});

test('delete tweet should return true', async () => {
	// @ts-ignore
	prismaMock.tweet.delete.mockResolvedValue(true);

	await expect(deleteTweet(1)).resolves.toEqual(true);
});
