import { getTwitterUser, insertTwitterUser } from '../twitter-users-model';
import { TwitterUser } from '../../accounts/accounts';
import prisma from '../../../../lib/prisma';
import { RoutesTestHarness } from '../../../tests/RoutesTestHarness';

const harness = new RoutesTestHarness();

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

const twitterAccount = harness.generateTwitterAccount();

test('insert twitter user should create and return a twitter user', async () => {
	const result = <TwitterUser>await insertTwitterUser(twitterAccount);

	expect(result).toEqual(twitterAccount);
});

test('get twitter user should return twitter user', async () => {
	const result = <TwitterUser>await getTwitterUser(twitterAccount.userId);

	expect(result).toEqual(twitterAccount);
});
