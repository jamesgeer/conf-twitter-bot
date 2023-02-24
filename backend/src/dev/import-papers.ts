import { readFile } from 'fs/promises';
import { insertPaper } from '../routes/papers/papers-model';

/**
 * Command to run this file:
 * ts-node /path/to/file/import-papers.ts
 *
 * This script will insert 125 papers or however many papers are in the JSON file
 */
const file = async (): Promise<string> => {
	try {
		return await readFile('./papers.json', 'utf8');
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
	id?: number;
	fullAbstract?: string;
	source: string;
	proceedingsId?: number;
}

(async (): Promise<void> => {
	const data = await file();
	if (data.length === 0) {
		return;
	}

	const { papers } = JSON.parse(data);

	let paper: ImportPaper;
	for (paper of papers) {
		delete paper?.id;
		delete paper?.proceedingsId;

		console.log(paper);
		paper.source = 'acm';
		try {
			await insertPaper(paper);
		} catch (e) {
			console.log(e);
		}
	}
})();
