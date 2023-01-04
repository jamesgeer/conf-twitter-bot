import supertest from 'supertest';
import http from 'http';
import HttpStatus from 'http-status';
import { faker } from '@faker-js/faker';
import { app } from '../../../app';
import { TestHarness } from '../../../tests/TestHarness';
import { User } from '../../types';

const request = supertest(http.createServer(app.callback()));

// after all tests complete
afterAll(async () => {
	await TestHarness.deleteAll();
});

const usersEndpoint = '/api/users';

const newUser = {
	username: faker.internet.userName(),
	password: faker.internet.password(),
};

let newUserId: number;

it('POST user should create user and return user', async () => {
	const response = await request.post(usersEndpoint).send(newUser);

	expect(response.status).toEqual(HttpStatus.CREATED);

	const createdUser: User = response.body;
	expect(createdUser.id).toBeGreaterThan(0);
	expect(createdUser.username).toEqual(newUser.username);

	newUserId = createdUser.id;
});

it('GET user should return user', async () => {
	const response = await request.get(`${usersEndpoint}/${newUserId}`);

	expect(response.status).toEqual(HttpStatus.OK);

	const user = response.body as User;
	expect(user.id).toEqual(newUserId);
	expect(user.username).toEqual(newUser.username);
});

it('GET user should return not found error', async () => {
	const response = await request.get(`${usersEndpoint}/${999}`);

	expect(response.status).toEqual(HttpStatus.NOT_FOUND);
});

it('POST user with an existing username should return conflict error', async () => {
	const response = await request.post(usersEndpoint).send(newUser);

	expect(response.status).toEqual(HttpStatus.CONFLICT);
});
