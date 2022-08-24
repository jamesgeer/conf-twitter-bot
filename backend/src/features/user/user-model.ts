import prisma from '../../lib/prisma';

export const getUser = (userId: string): void => {
	console.log('NOT IMPLEMENTED', userId);
};

// counts users with username, 0 === no users exist
const userExists = async (username: string): Promise<boolean> => {
	const result = await prisma.confUser.count({
		where: {
			username,
		},
	});

	return result > 0;
};

// attempts to insert user, fails if username taken
export const insertUser = async (username: string, password: string): Promise<boolean> => {
	if (await userExists(username)) {
		console.log('error: username taken');
		return false;
	}

	try {
		await prisma.confUser.create({
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
