import { Papers, PaperSearch } from './papers';
import { logToFile } from '../../logging/logging';
import prisma from '../../../lib/prisma';

let papers: Papers;
let searchedPapers: Papers;

export async function getPapers(): Promise<Papers> {
	try {
		papers = await prisma.paper.findMany().then((paperArray) => <Papers>paperArray);
	} catch (e) {
		console.error(e);
		console.log(logToFile(e));
		papers = [];
	}
	return papers;
}

// export async function getSearchedPapers(params: PaperSearch): Promise<Papers> {
// 	try {
// 		searchedPapers = await prisma.paper
// 			.findMany({
// 				where: params,
// 			})
// 			.then((paperArray) => <Papers>paperArray);
// 	} catch (e) {
// 		console.error(e);
// 		console.log(logToFile(e));
// 		searchedPapers = [];
// 	}
// 	return searchedPapers;
// }

/*
export const getPaper = (paperId: number): Paper => {
	papers = getPapers();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return papers.find((paper) => paper.id === paperId);
}; */
