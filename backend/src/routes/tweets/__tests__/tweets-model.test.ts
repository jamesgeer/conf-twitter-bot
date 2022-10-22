import HttpStatus from 'http-status';
import { prismaMock } from '../../../../lib/prismaMock';
import { insertTweet } from '../tweets-model';
import { HTTPTweet } from '../tweets';
import { ServerError } from '../../types';

const tweet = {
	id: 1,
	accountId: 1,
	twitterUserId: BigInt(1),
	scheduledTimeUTC: new Date().toUTCString(),
	content: 'My test tweet',
	sent: false,
	createdAt: new Date(),
	updatedAt: null,
};

test('should insert new tweet', async () => {
	// prisma keeps saying "date" is a string, must be a bug as I'm clearly doing "new Date():
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
