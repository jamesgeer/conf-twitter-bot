import { Paper, Papers, PaperSearchDB } from './papers';
import { logToFile } from '../../logging/logging';
import prisma from '../../../lib/prisma';

let papers: Papers;
let searchedPapers: Papers;

export async function getPapers(): Promise<Papers> {
	try {
		// get all Acm papers and all Researchr papers
		// https://github.com/prisma/prisma/discussions/4136 would be useful, but not possible here :(
		papers = await prisma.paper.findMany({}).then((papersArr) => <Papers>papersArr);
	} catch (e) {
		console.error(e);
		console.log(logToFile(e));
		papers = [];
	}
	return papers;
}

export async function getSearchedPapers(params: PaperSearchDB): Promise<Papers | []> {
	try {
		searchedPapers = await prisma.paper
			.findMany({
				where: {
					OR: [
						{
							title: {
								contains: params.title,
								mode: 'insensitive',
							},
							source: {
								equals: params.source,
							},
						},
					],
				},
			})
			.then((papersArr) => <Papers>papersArr);
	} catch (e) {
		console.error(e);
		console.log(logToFile(e));
		searchedPapers = [];
	}
	return searchedPapers;
}

export const insertTestPaper = async (acmPaper: Paper): Promise<Paper> =>
	// @ts-ignore
	prisma.paper.create({
		data: acmPaper,
	});

/*
export const getPaper = (paperId: number): Paper => {
	papers = getPapers();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return papers.find((paper) => paper.id === paperId);
}; */
