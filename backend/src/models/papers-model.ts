import { readFileSync } from 'fs';
import path from 'path';
import { Paper, Papers } from '../types/paper-types';

let papers: Papers;
const pathToFile = path.relative(process.cwd(), 'data/papers.json');

export const getPapers = (): Papers => {
	try {
		const fileContent = readFileSync(pathToFile).toString();
		papers = <Papers>JSON.parse(fileContent);
	} catch (e) {
		console.error(e);
		papers = [];
	}
	return papers;
};

export const getPaper = (paperId: number): Paper => {
	papers = getPapers();
	return papers.find((paper) => paper.id === paperId);
};
