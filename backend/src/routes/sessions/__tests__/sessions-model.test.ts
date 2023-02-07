import { faker } from '@faker-js/faker';
import HttpStatus from 'http-status';
import { validSessionCookie, validUserLogin } from '../sessions-model';
import { prismaMock } from '../../../../lib/prismaMock';
import { ServerError } from '../../types';

test('valid session cookie should return true', async () => {
	const requestCookie =
		// eslint-disable-next-line max-len
		'ConfTwBot=some_random_hash_string==; ConfTwBot.sig=not_real_sig';
	const sessionCookie = 'some_random_hash_string==';

	expect(validSessionCookie(requestCookie, sessionCookie)).toEqual(true);
});

test('invalid cookie name should return false', async () => {
	const requestCookie =
		// eslint-disable-next-line max-len
		'LameBot=some_random_hash_string==; LameBot.sig=not_real_sig';
	const sessionCookie = 'some_random_hash_string==';

	expect(validSessionCookie(requestCookie, sessionCookie)).toEqual(false);
});

test('invalid cookie length should return false', async () => {
	const requestCookie =
		// eslint-disable-next-line max-len
		'ConfTwBot=; ConfTwBot.sig=';
	const sessionCookie = 'some_random_hash_string==';

	expect(validSessionCookie(requestCookie, sessionCookie)).toEqual(false);
});

test('request and session cookie mismatching value should return false', async () => {
	const requestCookie =
		// eslint-disable-next-line max-len
		'ConfTwBot=some_value==; ConfTwBot.sig=not_real_sig';
	const sessionCookie = 'a_different_value==';

	expect(validSessionCookie(requestCookie, sessionCookie)).toEqual(false);
});

const user = {
	id: 1,
	username: faker.internet.userName(),
	password: faker.internet.password(),
	createdAt: faker.date.past(),
	updatedAt: faker.date.past(),
};

test('login to non-existent account should return unauthorised error', async () => {
	prismaMock.user.findUnique.mockResolvedValue(null);

	await expect(validUserLogin(user.username, user.password)).resolves.toEqual(
		new ServerError(HttpStatus.UNAUTHORIZED, 'Invalid username or password.'),
	);
});

test('login with incorrect password should return unauthorised error', async () => {
	prismaMock.user.findUnique.mockResolvedValue(user);

	await expect(validUserLogin(user.username, 'incorrect_password')).resolves.toEqual(
		new ServerError(HttpStatus.UNAUTHORIZED, 'Invalid username or password.'),
	);
});
