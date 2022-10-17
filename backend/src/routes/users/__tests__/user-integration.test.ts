import supertest from 'supertest';
import http from 'http';
import HttpStatus from 'http-status';
import { faker } from '@faker-js/faker';
import { app } from '../../../app';
import prisma from '../../../../lib/prisma';
import { insertUser } from '../users-model';

const apptest = supertest(http.createServer(app.callback()));

const newUser = {
	id: 0,
	username: faker.internet.userName(),
	password: faker.internet.password(),
};

// before any tests are run
beforeAll(async () => {
	await prisma.user.deleteMany({});
});

// after all tests complete
afterAll(async () => {
	await prisma.user.deleteMany({});
	await prisma.$disconnect();
});

it('should create 1 new user', async () => {
	console.log('Attempting to create a user');
	const result = await insertUser(newUser.username, newUser.password);
	expect(result).toBeGreaterThan(0);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	newUser.id = result;
	console.log('✨ one user successfully created!');
});

it('should get newly created account', async () => {
	const response = await apptest.get(`/api/users/${newUser.id}`);
	expect(response.status).toEqual(HttpStatus.OK);
	expect(response.body).toEqual({ id: newUser.id, username: newUser.username });
});
