import { Papers } from './papers';
import { logToFile } from '../../logging/logging';
import prisma from '../../../lib/prisma';

let papers: Papers;

export async function getPapers(): Promise<Papers> {
	try {
		// papers = await prisma.paper.findMany().then((paperArray) => <Papers>paperArray);
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
