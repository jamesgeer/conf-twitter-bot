import HttpStatus from 'http-status';
import bcrypt from 'bcrypt';
import prisma from '../../../lib/prisma';
import { ServerError } from '../types';

export const getUser = (userId: string): void => {
	console.log('NOT IMPLEMENTED', userId);
};

// counts users with username, 0 === no users exist
export const userExists = async (username: string): Promise<boolean> => {
	const result = await prisma.user.count({
		where: {
			username,
		},
	});

	return result > 0;
};

// attempts to insert user, fails if username taken
export const insertUser = async (username: string, plainTextPassword: string): Promise<boolean | ServerError> => {
	if (await userExists(username)) {
		return new ServerError(HttpStatus.CONFLICT, 'Username already in use.');
	}

	// plain text password converted to a hashed string
	const password = bcrypt.hashSync(plainTextPassword, 10);

	try {
		await prisma.user.create({
			data: {
				username,
				password,
			},
		});
	} catch (e) {
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to create account due to server problem.');
	}

	// successfully inserted
	return true;
};
