import { faker } from '@faker-js/faker';
import { TestHarness } from '../../../../tests/TestHarness';
import { getScheduledTweets } from '../schedule-tweets-model';
import { insertTweet } from '../../../../routes/tweets/tweets-model';
import { Tweet, Tweets } from '../../../../routes/tweets/tweets';

const testData1 = new TestHarness();
const testData2 = new TestHarness();

// before any tests are run
beforeAll(async () => {
	await testData1.createStandard();
	await testData1.createTwitterOAuth(testData1.getTwitterUser());

	await testData2.createStandard();
	await testData2.createTwitterOAuth(testData2.getTwitterUser());
});

// after all tests complete
afterAll(async () => {
	await TestHarness.deleteAll();
});

it('get scheduled tweets', async () => {
	const expectedResult = [
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

	for (let i = 0; i < 3; i++) {
		const httpTweet = {
			accountId: testData1.getAccount().id.toString(),
			twitterUserId: testData1.getTwitterUser().id.toString(),
			dateTime: new Date().toString(),
			content: faker.lorem.lines(1),
		};

		const tweet = <Tweet>await insertTweet(httpTweet);
		expectedResult[0].tweets.push(tweet);
	}

	for (let i = 0; i < 2; i++) {
		const httpTweet = {
			accountId: testData2.getAccount().id.toString(),
			twitterUserId: testData2.getTwitterUser().id.toString(),
			dateTime: new Date().toString(),
			content: faker.lorem.lines(2),
		};

		const tweet = <Tweet>await insertTweet(httpTweet);
		expectedResult[1].tweets.push(tweet);
	}

	const result = await getScheduledTweets();
	expect(result).toEqual(expectedResult);
});
