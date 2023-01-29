import { Papers } from './papers';
import { logToFile } from '../../logging/logging';
import prisma from '../../../lib/prisma';

let papers: Papers;

export async function getPapers(): Promise<Papers> {
	try {
		// get all Acm papers and all Researchr papers
		// https://github.com/prisma/prisma/discussions/4136 would be useful, but not possible here :(
		const acmPapers = await prisma.acmPaper.findMany().then((paperArray) => <Papers>paperArray);
		const rschrPapers = await prisma.researchrPaper.findMany().then((paperArray) => <Papers>paperArray);
		papers = acmPapers.concat(rschrPapers);
	} catch (e) {
		console.error(e);
		console.log(logToFile(e));
		papers = [];
	}
	return papers;
}

/*
export const getPaper = (paperId: number): Paper => {
	papers = getPapers();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return papers.find((paper) => paper.id === paperId);
}; */
