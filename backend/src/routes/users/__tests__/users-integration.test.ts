import supertest from 'supertest';
import http from 'http';
import HttpStatus from 'http-status';
import { faker } from '@faker-js/faker';
import { app } from '../../../app';
import prisma from '../../../../lib/prisma';
import { insertUser } from '../users-model';

const request = supertest(http.createServer(app.callback()));

const newUser = {
	id: 0,
	username: faker.internet.userName(),
	password: faker.internet.password(),
};

// after all tests complete
afterAll(async () => {
	await prisma.user.deleteMany({});
	await prisma.$disconnect();
});

it('should create 1 new user', async () => {
	const result = await insertUser(newUser.username, newUser.password);
	expect(result).toBeGreaterThan(0);
	// @ts-ignore
	newUser.id = result;
});

it('should get newly created account', async () => {
	const response = await request.get(`/api/users/${newUser.id}`);
	expect(response.status).toEqual(HttpStatus.OK);
	expect(response.body).toEqual({ id: newUser.id, username: newUser.username });
});
