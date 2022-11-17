import supertest from 'supertest';
import http from 'http';
import HttpStatus from 'http-status';
import { faker } from '@faker-js/faker';
import { app } from '../../../app';
import prisma from '../../../../lib/prisma';
import { insertUser } from '../users-model';
import { User } from '../../types';

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

it('should create one new user', async () => {
	const user = <User>await insertUser(newUser.username, newUser.password);
	expect(user.id).toBeGreaterThan(0);
	newUser.id = user.id;
});

it('should get newly created account', async () => {
	const response = await request.get(`/api/users/${newUser.id}`);
	expect(response.status).toEqual(HttpStatus.OK);
	expect(response.body).toEqual({ id: newUser.id, username: newUser.username });
});
