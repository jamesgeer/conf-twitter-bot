import prisma from '../lib/prisma';

// testing prisma, delete file later
const allUsers = async () => {
	const response = await prisma.user.findMany({
		include: {
			posts: true,
			profile: true,
		},
	});
	console.dir(response, { depth: null });
};

allUsers().then();
