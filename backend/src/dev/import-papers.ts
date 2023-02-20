import { readFile } from 'fs/promises';
import prisma from '../../lib/prisma';

/**
 * Command to run this file:
 * ts-node /path/to/file/import-papers.ts
 *
 * This script will insert 125 papers or however many papers are in the JSON file
 */
const file = async (): Promise<string> => {
	try {
		return await readFile('./data.json', 'utf8');
	} catch (e) {
		console.log(e);
		return '';
	}
};

interface ImportPaper {
	type: string;
	title: string;
	url: string;
	doi: string;
	authors: string[];
	monthYear: string;
	pages: string;
	shortAbstract: string;
	citations: number;
	downloads: number;
	id: number;
	proceedingsId: number;
	fullAbstract?: string;
}

(async (): Promise<void> => {
	const data = await file();
	if (data.length === 0) {
		return;
	}

	const { papers } = JSON.parse(data);
	let paper: ImportPaper;
	for (paper of papers) {
		try {
			await prisma.acmPaper.upsert({
				where: {
					doi: paper.doi,
				},
				update: {
					type: paper.type,
					title: paper.title,
					authors: paper.authors,
					fullAuthors: '',
					url: paper.url,
					preprint: '',
					shortAbstract: paper.shortAbstract,
					fullAbstract: paper.fullAbstract,
					monthYear: paper.monthYear,
					pages: paper.pages,
					citations: paper.citations,
					downloads: paper.downloads,
					source: 'acm',
				},
				create: {
					type: paper.type,
					title: paper.title,
					authors: paper.authors,
					fullAuthors: '',
					doi: paper.doi,
					url: paper.url,
					preprint: '',
					shortAbstract: paper.shortAbstract,
					fullAbstract: paper.fullAbstract,
					monthYear: paper.monthYear,
					pages: paper.pages,
					citations: paper.citations,
					downloads: paper.downloads,
					source: 'acm',
				},
			});
		} catch (e) {
			console.log(e);
		}
	}
})();
