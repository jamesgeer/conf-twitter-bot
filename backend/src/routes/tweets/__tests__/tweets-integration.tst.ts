import { faker } from '@faker-js/faker';
import prisma from '../../../../lib/prisma';
import { insertUser } from '../../users/users-model';
import { insertTwitterUser } from '../../twitter-users/twitter-users-model';
import { TwitterAccount } from '../../oauths/oauths';
import { Account, TwitterUser } from '../../accounts/accounts';
import { insertTweet } from '../tweets-model';
import { insertAccount } from '../../accounts/accounts-model';

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

// before any tests are run
beforeAll(async () => {
	user.id = <number>await insertUser(user.username, user.password);
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

it('should create 1 new tweet', async () => {
	const httpTweet = {
		accountId: account.id.toString(),
		twitterUserId: twitterUser.id.toString(),
		scheduledTimeUTC: new Date().toUTCString(),
		content: 'My test tweet',
	};

	const result = await insertTweet(httpTweet);

	expect(result).toEqual(true);
});
