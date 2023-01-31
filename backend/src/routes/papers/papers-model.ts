import { Paper, Papers, PaperSearchDB } from './papers';
import { logToFile } from '../../logging/logging';
import prisma from '../../../lib/prisma';

let papers: Papers;
let searchedPapers: Papers;

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

export async function getSearchedPapers(params: PaperSearchDB): Promise<Papers | []> {
	console.log(params);

	try {
		// @ts-ignore
		return await prisma.paper.findMany({
			where: {
				title: {
					contains: params.title,
					mode: 'insensitive',
				},
				type: {
					equals: params.type,
				},
			},
		});
	} catch (e) {
		console.error(e);
		console.log(logToFile(e));
		return [];
	}
}

export interface TestPaper {
	type: string;
	title: string;
	authors: string;
	doi: string;
	url: string;
	shortAbstract: string;
}

export const insertTestPaper = async (testPaper: TestPaper): Promise<Paper> =>
	// @ts-ignore
	prisma.paper.create({
		data: testPaper,
	});

/*
export const getPaper = (paperId: number): Paper => {
	papers = getPapers();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return papers.find((paper) => paper.id === paperId);
}; */
