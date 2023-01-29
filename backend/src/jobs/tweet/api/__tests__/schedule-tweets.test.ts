import { faker } from '@faker-js/faker';
import { TestHarness } from '../../../../tests/TestHarness';
import { getScheduledTweets } from '../schedule-tweets-model';
import { insertTweet, updateTweetSent } from '../../../../routes/tweets/tweets-model';
import { Tweet, Tweets } from '../../../../routes/tweets/tweets';
import { ScheduledTweets } from '../schedule-tweets';
import { insertUpload } from '../../../../routes/uploads/uploads-model';
import { Upload } from '../../../../routes/uploads/uploads';
import prisma from '../../../../../lib/prisma';

const testData1 = new TestHarness();
const testData2 = new TestHarness();
const testData3 = new TestHarness();

// before any tests are run
beforeAll(async () => {
	await testData1.createStandard();
	await testData1.createTwitterOAuth(testData1.getTwitterUser());

	await testData2.createStandard();
	await testData2.createTwitterOAuth(testData2.getTwitterUser());

	await testData3.createStandard();
});

// after all tests complete
afterAll(async () => {
	await TestHarness.deleteAll();
});

describe('scheduled tweets should be an empty array', () => {
	it('no tweets scheduled', async () => {
		const result = await getScheduledTweets();

		expect(result).toEqual([]);
	});

	it('tweet scheduled in the future', async () => {
		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 14);

		// this tweet should not be in the results
		const futureTweet = {
			accountId: testData1.getAccount().id.toString(),
			twitterUserId: testData1.getTwitterUser().id.toString(),
			dateTime: futureDate.toString(),
			content: faker.lorem.lines(2),
		};

		await insertTweet(futureTweet);

		const result = await getScheduledTweets();
		expect(result).toEqual([]);
	});

	it('tweet marked as sent', async () => {
		const httpTweet = {
			accountId: testData1.getAccount().id.toString(),
			twitterUserId: testData1.getTwitterUser().id.toString(),
			dateTime: new Date().toString(),
			content: faker.lorem.lines(2),
		};

		const tweet = <Tweet>await insertTweet(httpTweet);
		await updateTweetSent(tweet.id, true);

		const result = await getScheduledTweets();
		expect(result).toEqual([]);
	});

	it('twitter user missing oauth', async () => {
		const httpTweet = {
			accountId: testData3.getAccount().id.toString(),
			twitterUserId: testData3.getTwitterUser().id.toString(),
			dateTime: new Date().toString(),
			content: faker.lorem.lines(2),
		};

		await insertTweet(httpTweet);
		const result = await getScheduledTweets();
		expect(result).toEqual([]);
	});
});

it('get scheduled tweets should return one tweet with uploads', async () => {
	const now = new Date();

	const httpTweet = {
		accountId: testData1.getAccount().id.toString(),
		twitterUserId: testData1.getTwitterUser().id.toString(),
		dateTime: now.toString(),
		content: faker.lorem.lines(1),
	};

	const tweet = <Tweet>await insertTweet(httpTweet);

	const upload = {
		id: 0,
		tweetId: tweet.id,
		name: 'someName',
		url: 'someUrl',
		alt: '',
		type: '',
	};

	const uploadObj = <Upload>await insertUpload(upload);

	const result = <ScheduledTweets>await getScheduledTweets();

	const resultUpload = result[0].tweets[0].uploads;
	expect(resultUpload?.length).toBe(1);
	expect(resultUpload).toEqual([uploadObj]);

	await prisma.upload.deleteMany({});
	await prisma.tweet.deleteMany({});
});

it('get scheduled tweets', async () => {
	const expectedResult: ScheduledTweets = [
		{
			id: testData1.getTwitterUser().id,
			tweets: <Tweets>[],
			oauth: testData1.getTwitterOAuth(),
		},
		{
			id: testData2.getTwitterUser().id,
			tweets: <Tweets>[],
			oauth: testData2.getTwitterOAuth(),
		},
	];

	const now = new Date();

	for (let i = 0; i < 3; i++) {
		const httpTweet = {
			accountId: testData1.getAccount().id.toString(),
			twitterUserId: testData1.getTwitterUser().id.toString(),
			dateTime: now.toString(),
			content: faker.lorem.lines(1),
		};

		const tweet = <Tweet>await insertTweet(httpTweet);
		tweet.uploads = [];
		expectedResult[0].tweets.push(tweet);
	}

	for (let i = 0; i < 2; i++) {
		const httpTweet = {
			accountId: testData2.getAccount().id.toString(),
			twitterUserId: testData2.getTwitterUser().id.toString(),
			dateTime: now.toString(),
			content: faker.lorem.lines(2),
		};

		const tweet = <Tweet>await insertTweet(httpTweet);
		tweet.uploads = [];
		expectedResult[1].tweets.push(tweet);
	}

	const futureDate = new Date();
	futureDate.setDate(futureDate.getDate() + 14);

	// this tweet should not be in the results
	const futureTweet = {
		accountId: testData2.getAccount().id.toString(),
		twitterUserId: testData2.getTwitterUser().id.toString(),
		dateTime: futureDate.toString(),
		content: faker.lorem.lines(2),
	};
	await insertTweet(futureTweet);

	const result = await getScheduledTweets();

	expect(result.length).toBe(2);
	expect(result[0].tweets.length).toBe(3);
	expect(result[1].tweets.length).toBe(2);

	for (let i = 0; i < result.length; i++) {
		if (result[i].tweets) {
			for (let j = 0; j < result[i].tweets.length; j++) {
				expect(result[i].tweets[j].sent).toBe(false);
			}
		}
	}
});
