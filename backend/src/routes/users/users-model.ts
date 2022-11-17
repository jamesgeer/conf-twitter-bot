import HttpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/prisma';
import { ServerError, User } from '../types';
import { logToFile } from '../../logging/logging';

export const getUser = (userId: string): Promise<User | null> =>
	prisma.user.findUnique({
		where: {
			id: +userId,
		},
		select: {
			id: true,
			username: true,
		},
	});

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
export const insertUser = async (username: string, plainTextPassword: string): Promise<User | ServerError> => {
	if (await userExists(username)) {
		return new ServerError(HttpStatus.CONFLICT, 'Username already in use.');
	}

	// plain text password converted to a hashed string
	const password = bcrypt.hashSync(plainTextPassword, 10);

	try {
		return await prisma.user.create({
			data: {
				username,
				password,
			},
			select: {
				id: true,
				username: true,
			},
		});
	} catch (e) {
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to create account due to server problem.');
	}
};
