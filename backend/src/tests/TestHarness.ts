// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { User } from '../routes/types';
import { TwitterUserOAuth } from '../routes/oauths/oauths';
import { Account, TwitterUser } from '../routes/accounts/accounts';
import { HTTPTweet, Tweet } from '../routes/tweets/tweets';
import { insertUser } from '../routes/users/users-model';
import { insertTwitterUser } from '../routes/twitter-users/twitter-users-model';
import { insertAccount } from '../routes/accounts/accounts-model';
import { insertTweet } from '../routes/tweets/tweets-model';
import prisma from '../../lib/prisma';

export class TestHarness {
	user: User;
	twitterUser: TwitterUser;
	twitterUserOAuth: TwitterUserOAuth;
	account: Account;
	httpTweet: HTTPTweet;

	constructor() {
		this.user = {
			id: 0,
			username: '',
		};

		this.twitterUser = {
			id: BigInt(0),
			name: '',
			screenName: '',
			profileImageUrl: '',
		};

		this.twitterUserOAuth = {
			twitterUser: this.twitterUser,
			oauth: {},
		};

		this.account = {
			id: 0,
			userId: 0,
			twitterUser: this.twitterUser,
		};
	}

	public generateTwitterUser(): TwitterUser {
		this.twitterUser = {
			id: faker.datatype.bigInt(),
			name: faker.internet.userName().replace('_', ' '),
			screenName: faker.internet.userName(),
			profileImageUrl: faker.internet.avatar(),
		};

		return this.twitterUser;
	}

	public async createUser(): Promise<User> {
		this.user = <User>await insertUser(faker.internet.userName(), faker.internet.password());
		return this.user;
	}

	public async createTwitterUser(user: User, twitterUser: TwitterUser): Promise<TwitterUser> {
		this.twitterUser = <TwitterUser>await insertTwitterUser(user.id, twitterUser);
		return this.twitterUser;
	}

	public async createAccount(user: User, twitterUser: TwitterUser): Promise<Account> {
		this.account = <Account>await insertAccount(user.id, twitterUser.id);
		return this.account;
	}

	public async createStandard(): Promise<void> {
		const user = await this.createUser();
		const newTwitterUser = this.generateTwitterUser();

		const twitterUser = await this.createTwitterUser(user, newTwitterUser);

		await this.createAccount(user, twitterUser);
	}

	static async deleteAll(): Promise<void> {
		await prisma.tweet.deleteMany({});
		await prisma.account.deleteMany({});
		await prisma.twitterUser.deleteMany({});
		await prisma.user.deleteMany({});
		await prisma.$disconnect();
	}

	public getUser(): User {
		return this.user;
	}

	public getTwitterUser(): TwitterUser {
		return this.twitterUser;
	}

	public getAccount(): Account {
		return this.account;
	}

	public createHttpTweet(): HTTPTweet {
		this.httpTweet = {
			accountId: this.account.id.toString(),
			twitterUserId: this.twitterUser.id.toString(),
			dateTime: new Date().toString(),
			content: 'My test tweet',
		};
		return this.httpTweet;
	}

	public async createTweet(): Promise<Tweet> {
		return <Tweet>await insertTweet(this.createHttpTweet());
	}
}
