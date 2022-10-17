// eslint-disable-next-line node/no-unpublished-import
import supertest from 'supertest';
import http from 'http';
import HttpStatus from 'http-status';
import { app } from '../../../app';
import prisma from '../../../../lib/prisma';
import { insertUser } from '../../users/users-model';

const apptest = supertest(http.createServer(app.callback()));

// const account = {
// 	id: 1,
// 	userId: 1,
// 	twitterUserId: BigInt(1),
// };

afterAll(async () => {
	prisma.user.deleteMany();
	await prisma.$disconnect();
});

it('should create 1 new user', async () => {
	console.log('Attempting to create a user');
	const newUser = await insertUser('Simon Test-man', 'password');
	expect(newUser).toEqual(true);
	console.log('✨ one user successfully created!');
});

// test('get account route should return 404/not found', async () => {
// 	prismaMock.account.findUnique.mockResolvedValue(null);
//
// 	const response = await apptest.get('/api/accounts/1');
// 	expect(response.status).toEqual(HttpStatus.NOT_FOUND);
// 	expect(response.body).toEqual({ message: 'Account not found.' });
// });
