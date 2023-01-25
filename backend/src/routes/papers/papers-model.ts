import { Paper, Papers, PaperSearchDB } from './papers';
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

export async function getSearchedPapers(params: PaperSearchDB): Promise<Papers | []> {
	try {
		// @ts-ignore
		return await prisma.paper.findMany({
			where: {
				title: {
					contains: params.title,
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
