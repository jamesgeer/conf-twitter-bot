import HttpStatus from 'http-status';
import prisma from '../../../lib/prisma';
import { ServerError } from '../types';

export const getUser = (userId: string): void => {
	console.log('NOT IMPLEMENTED', userId);
};

// counts users with username, 0 === no users exist
const userExists = async (username: string): Promise<boolean> => {
	const result = await prisma.user.count({
		where: {
			username,
		},
	});

	return result > 0;
};

// attempts to insert user, fails if username taken
export const insertUser = async (username: string, password: string): Promise<boolean | ServerError> => {
	if (await userExists(username)) {
		return new ServerError(HttpStatus.CONFLICT, 'Username already in use.');
	}

	try {
		await prisma.user.create({
			data: {
				username,
				password,
			},
		});
	} catch (e) {
		console.log(e);
		return false;
	}

	console.log(username, 'successfully inserted');
	return true;
};
