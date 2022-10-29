import HttpStatus from 'http-status';
import { prismaMock } from '../../../../lib/prismaMock';
import { deleteTweet, insertTweet, updateTweet } from '../tweets-model';
import { HTTPTweet, Tweet } from '../tweets';
import { ServerError } from '../../types';

const newTweet: HTTPTweet = {
	accountId: '1',
	twitterUserId: BigInt(1).toString(),
	scheduledTimeUTC: new Date().toISOString(),
	content: 'My test tweet',
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

test('update tweet should return newly updated tweet', async () => {
	const updatedTweet: Tweet = {
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

	// @ts-ignore
	prismaMock.tweet.update.mockResolvedValue(updatedTweet);

	await expect(updateTweet(updatedTweet)).resolves.toEqual(updatedTweet);
});

test('delete tweet should return true', async () => {
	// @ts-ignore
	prismaMock.tweet.delete.mockResolvedValue(true);

	await expect(deleteTweet(1)).resolves.toEqual(true);
});
