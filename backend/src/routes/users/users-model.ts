import HttpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/prisma';
import { ServerError, User } from '../types';
import { logToFile } from '../../logging/logging';

export const getUser = async (userId: string): Promise<User | ServerError> => {
	try {
		const result = await prisma.user.findUnique({
			where: {
				id: +userId,
			},
			select: {
				id: true,
				username: true,
			},
		});
		if (result) {
			return result;
		}
		return new ServerError(HttpStatus.NOT_FOUND, `User with ID ${userId} not found.`);
	} catch (e) {
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to get user due to server problem.');
	}
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
