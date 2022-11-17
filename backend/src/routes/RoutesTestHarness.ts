// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { User } from './types';
import { TwitterAccount } from './oauths/oauths';
import { Account, TwitterUser } from './accounts/accounts';
import { insertUser } from './users/users-model';
import { insertTwitterUser } from './twitter-users/twitter-users-model';
import { insertAccount } from './accounts/accounts-model';
import { HTTPTweet } from './tweets/tweets';

export class RoutesTestHarness {
	user: User;
	twitterAccount: TwitterAccount;
	twitterUser: TwitterUser;
	account: Account;
	httpTweet: HTTPTweet;

	constructor() {
		this.user = {
			id: 0,
			username: '',
		};

		this.twitterAccount = {
			userId: '0',
			name: '',
			screenName: '',
			profileImageUrl: '',
			oauth: {},
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

	public async createUser(): Promise<void> {
		this.user = <User>await insertUser(faker.internet.userName(), faker.internet.password());
	}

	public async createTwitterUser(): Promise<void> {
		this.twitterAccount = {
			userId: this.user.id.toString(),
			name: faker.internet.userName().replace('_', ' '),
			screenName: faker.internet.userName(),
			profileImageUrl: faker.internet.avatar(),
			oauth: {},
		};

		this.twitterUser.id = <bigint>await insertTwitterUser(this.twitterAccount);
	}

	public async createTwitterAccount(): Promise<void> {
		this.account.userId = this.user.id;
		this.account.twitterUser = this.twitterUser;

		this.account.id = <number>await insertAccount(this.user.id, this.twitterUser.id);
	}

	public async createStandard(): Promise<void> {
		await this.createUser();
		await this.createTwitterUser();
		await this.createTwitterAccount();
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
			scheduledTimeUTC: new Date().toString(),
			content: 'My test tweet',
		};
		return this.httpTweet;
	}
}
