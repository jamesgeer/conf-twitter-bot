import { Papers } from '../papers/papers';
import prisma from '../../../lib/prisma';
import { logToFile } from '../../logging/logging';

export async function uploadPapersToDatabase(
	papers: Papers,
	errors: string,
): Promise<{ success: boolean; errors: string }> {
	if (papers.length === 0) {
		errors += 'No papers to upload.\n';
		return { success: false, errors };
	}
	for (const thisPaper of papers) {
		try {
			switch (thisPaper.source) {
				case 'acm':
					// acm always has a doi, so it's easy to find
					// have to do it this way because upsert requires unique columns
					await prisma.paper.deleteMany({
						where: {
							AND: {
								doi: thisPaper.doi,
								source: thisPaper.source,
							},
						},
					});
					await prisma.paper.create({
						data: thisPaper,
					});
					break;
				case 'rschr':
					await prisma.paper.deleteMany({
						where: {
							AND: {
								title: thisPaper.title,
								source: thisPaper.source,
							},
						},
					});
					await prisma.paper.create({
						data: thisPaper,
					});
					break;
				case 'kar':
					await prisma.paper.deleteMany({
						where: {
							AND: {
								title: thisPaper.title,
								url: thisPaper.url,
								source: thisPaper.source,
							},
						},
					});
					await prisma.paper.create({
						data: thisPaper,
					});
					break;
				default:
					errors += `Could not trace website source ${thisPaper.url}\n`;
			}
		} catch (e) {
			errors += 'Error while uploading to database.\n';
			console.log(logToFile(e));
			return { success: false, errors };
		}
	}
	return { success: true, errors };
}
