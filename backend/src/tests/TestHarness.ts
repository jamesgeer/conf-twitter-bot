// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { User } from '../routes/types';
import { TwitterOAuth } from '../routes/oauths/oauths';
import { Account, TwitterUser } from '../routes/accounts/accounts';
import { HTTPTweet, Tweet } from '../routes/tweets/tweets';
import { insertUser } from '../routes/users/users-model';
import { insertTwitterUser } from '../routes/twitter-users/twitter-users-model';
import { insertAccount } from '../routes/accounts/accounts-model';
import { insertTweet } from '../routes/tweets/tweets-model';
import prisma from '../../lib/prisma';
import { insertTwitterOAuth } from '../routes/oauths/oauths-model';

export class TestHarness {
	user: User;
	twitterUser: TwitterUser;
	twitterOAuth: TwitterOAuth;
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

	public async createTwitterOAuth(twitterUser: TwitterUser): Promise<TwitterOAuth> {
		this.twitterOAuth = <TwitterOAuth>await insertTwitterOAuth(twitterUser.id, 'token', 'secret');
		return this.twitterOAuth;
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
		await prisma.twitterOAuth.deleteMany({});
		await prisma.upload.deleteMany({});
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

	public getTwitterOAuth(): TwitterOAuth {
		return this.twitterOAuth;
	}

	public getAccount(): Account {
		return this.account;
	}

	public async generateHttpTweet(): Promise<HTTPTweet> {
		await this.createStandard();

		this.httpTweet = {
			accountId: this.getAccount().id.toString(),
			twitterUserId: this.getTwitterUser().id.toString(),
			dateTime: new Date().toString(),
			content: faker.lorem.lines(1),
		};

		return this.httpTweet;
	}

	public async createTweet(): Promise<Tweet> {
		return <Tweet>await insertTweet(await this.generateHttpTweet());
	}
}
