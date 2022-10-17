import { readFileSync } from 'fs';
import path from 'path';
import { Paper, Papers } from './papers';
import { logToFile } from '../../logging/logging';

let papers: Papers;
const pathToFile = path.relative(process.cwd(), 'data/papers.json');

export const getPapers = (): Papers => {
	try {
		const fileContent = readFileSync(pathToFile).toString();
		papers = <Papers>JSON.parse(fileContent);
	} catch (e) {
		console.error(e);
		console.log(logToFile(e));
		papers = [];
	}
	return papers;
};

export const getPaper = (paperId: number): Paper => {
	papers = getPapers();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return papers.find((paper) => paper.id === paperId);
};
