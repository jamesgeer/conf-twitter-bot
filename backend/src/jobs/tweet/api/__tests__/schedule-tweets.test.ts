import { faker } from '@faker-js/faker';
import { TestHarness } from '../../../../tests/TestHarness';
import { getScheduledTweets } from '../schedule-tweets-model';
import { insertTweet } from '../../../../routes/tweets/tweets-model';

const harness = new TestHarness();

// before any tests are run
beforeAll(async () => {
	await harness.createStandard();
});

// after all tests complete
afterAll(async () => {
	await TestHarness.deleteAll();
});

it('beep', async () => {
	const tweet = await harness.createTweet();

	for (let i = 0; i < 10; i++) {
		const httpTweet = {
			accountId: harness.getAccount().id.toString(),
			twitterUserId: harness.getTwitterUser().id.toString(),
			dateTime: new Date().toString(),
			content: faker.lorem.lines(1),
		};
		await insertTweet(httpTweet);
	}

	const result = await getScheduledTweets();
	console.log(result);
	expect(result).toEqual(tweet);
});
