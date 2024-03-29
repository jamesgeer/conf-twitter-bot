import HttpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import { ServerError } from '../types';
import prisma from '../../../lib/prisma';

export const validSessionCookie = (requestCookie: string, sessionCookie: string): boolean => {
	if (requestCookie && requestCookie.length > 0) {
		// extract the ConfTwBot cookie (request may contain many cookies)
		// @ts-ignore
		const confTwBotCookie = requestCookie.split('; ConfTwBot=').pop().split(';')[0].replace('ConfTwBot=', '');
		// if the confTwBot cookie is missing, then the variable will contain an empty string
		if (confTwBotCookie.length > 0) {
			// verify browser cookie matches existing session cookie
			if (confTwBotCookie === sessionCookie) {
				return true;
			}
			// console.log(`expected: ConfTwBot=${sessionCookie}  but got: ${confTwBotCookie}`);
		}
	}

	return false;
};

// return user id if login successful, otherwise return error
export const validUserLogin = async (username: string, plainTextPassword: string): Promise<number | ServerError> => {
	// get password hash for provided username
	const result = await prisma.user.findUnique({
		where: {
			username,
		},
		select: {
			id: true,
			password: true,
		},
	});

	// extract password from result and rename to hash
	if (result === null) {
		return new ServerError(HttpStatus.UNAUTHORIZED, 'Invalid username or password.');
	}

	const { id: userId, password: hash } = result;

	// returns comparison result of provided password and stored hash
	if (bcrypt.compareSync(plainTextPassword, hash)) {
		return userId;
	}

	return new ServerError(HttpStatus.UNAUTHORIZED, 'Incorrect password.');
};
