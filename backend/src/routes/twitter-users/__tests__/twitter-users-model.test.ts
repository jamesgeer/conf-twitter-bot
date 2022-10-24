import { prismaMock } from '../../../../lib/prismaMock';
import { getTwitterUser, insertTwitterUser } from '../twitter-users-model';
import { TwitterAccount } from '../../oauths/oauths';
import { TwitterUser } from '../../accounts/accounts';

const twitterUser: TwitterUser = {
	id: BigInt(1),
	name: 'test_account',
	screenName: 'Test Account',
	profileImageUrl: 'image.png',
};

const twitterAccount: TwitterAccount = {
	userId: twitterUser.id.toString(),
	name: twitterUser.name,
	screenName: twitterUser.screenName,
	profileImageUrl: twitterUser.profileImageUrl,
	oauth: {},
};

test('should create twitter user', async () => {
	prismaMock.twitterUser.create.mockResolvedValue(twitterUser);

	await expect(insertTwitterUser(twitterAccount)).resolves.toEqual(twitterUser.id);
});

test('get twitter user should return twitter user', async () => {
	prismaMock.twitterUser.findUnique.mockResolvedValue(twitterUser);

	await expect(getTwitterUser(twitterAccount.userId)).resolves.toEqual(twitterUser);
});

test('get twitter user should return null', async () => {
	prismaMock.twitterUser.findUnique.mockResolvedValue(null);

	await expect(getTwitterUser(twitterAccount.userId)).resolves.toEqual(null);
});
