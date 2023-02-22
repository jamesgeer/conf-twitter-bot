import { AcmPaper, Papers, PaperSearchDB } from './papers';
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
		const acmPapers = await prisma.acmPaper
			.findMany({
				where: {
					title: {
						contains: params.title,
						mode: 'insensitive',
					},
					source: {
						equals: params.source,
					},
				},
			})
			.then((paperArray) => <Papers>paperArray);

		const rschrPapers = await prisma.researchrPaper
			.findMany({
				where: {
					title: {
						contains: params.title,
						mode: 'insensitive',
					},
					source: {
						equals: params.source,
					},
				},
			})
			.then((paperArray) => <Papers>paperArray);

		searchedPapers = acmPapers.concat(rschrPapers);
	} catch (e) {
		console.error(e);
		console.log(logToFile(e));
		searchedPapers = [];
	}
	return searchedPapers;
}

export async function getAuthorsPapers(author: string): Promise<Papers> {
	try {
		const acmPapers = await prisma.acmPaper
			.findMany({ where: { authors: { has: author } } })
			.then((paperArray) => <Papers>paperArray);
		const rschrPapers = await prisma.researchrPaper
			.findMany({ where: { authors: { has: author } } })
			.then((paperArray) => <Papers>paperArray);
		papers = acmPapers.concat(rschrPapers);
	} catch (e) {
		console.error(e);
		console.log(logToFile(e));
		papers = [];
	}
	return papers;
}

export const insertTestPaper = async (acmPaper: AcmPaper): Promise<AcmPaper> =>
	// @ts-ignore
	prisma.acmPaper.create({
		data: acmPaper,
	});

/*
export const getPaper = (paperId: number): Paper => {
	papers = getPapers();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return papers.find((paper) => paper.id === paperId);
}; */
