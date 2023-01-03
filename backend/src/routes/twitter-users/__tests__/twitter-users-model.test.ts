import { getTwitterUser, insertTwitterUser } from '../twitter-users-model';
import { TwitterUser } from '../../accounts/accounts';
import prisma from '../../../../lib/prisma';
import { TestHarness } from '../../../tests/TestHarness';

const harness = new TestHarness();

beforeAll(async () => {
	await harness.createUser();
});

// after all tests complete
afterAll(async () => {
	await prisma.tweet.deleteMany({});
	await prisma.account.deleteMany({});
	await prisma.twitterUser.deleteMany({});
	await prisma.user.deleteMany({});
	await prisma.$disconnect();
});

const twitterUser = harness.generateTwitterUser();

test('insert twitter user should create and return a twitter user', async () => {
	const result = <TwitterUser>await insertTwitterUser(twitterUser);

	expect(result).toEqual(twitterUser);
});

test('get twitter user should return twitter user', async () => {
	const result = <TwitterUser>await getTwitterUser(twitterUser.id);

	expect(result).toEqual(twitterUser);
});
