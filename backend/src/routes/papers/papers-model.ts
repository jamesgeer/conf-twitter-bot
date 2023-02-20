import { AcmPaper, Papers, PaperSearchDB, RschrPaper } from './papers';
import { logToFile } from '../../logging/logging';
import prisma from '../../../lib/prisma';

let papers: Papers;
let searchedPapers: Papers;

export async function getPapers(): Promise<Papers> {
	try {
		// get all Acm papers and all Researchr papers
		// https://github.com/prisma/prisma/discussions/4136 would be useful, but not possible here :(
		const papersData = await prisma.paper.findMany({
			include: {
				AcmPaper: true,
				ResearchrPaper: true,
			},
		});
		papers = [];
		for (const paper of papersData) {
			if (paper.ResearchrPaper) {
				papers.push(<RschrPaper>paper.ResearchrPaper);
			}
			if (paper.AcmPaper) {
				papers.push(<AcmPaper>paper.AcmPaper);
			}
		}
	} catch (e) {
		console.error(e);
		console.log(logToFile(e));
		papers = [];
	}
	return papers;
}

export async function getSearchedPapers(params: PaperSearchDB): Promise<Papers | []> {
	try {
		searchedPapers = [];
		const papersData = await prisma.paper.findMany({
			where: {
				OR: [
					{
						AcmPaper: {
							title: {
								contains: params.title,
								mode: 'insensitive',
							},
							source: {
								equals: params.source,
							},
						},
					},
					{
						ResearchrPaper: {
							title: {
								contains: params.title,
								mode: 'insensitive',
							},
							source: {
								equals: params.source,
							},
						},
					},
				],
			},
			include: {
				AcmPaper: true,
				ResearchrPaper: true,
			},
		});
		for (const paper of papersData) {
			if (paper.ResearchrPaper) {
				searchedPapers.push(<RschrPaper>paper.ResearchrPaper);
			}
			if (paper.AcmPaper) {
				searchedPapers.push(<AcmPaper>paper.AcmPaper);
			}
		}
	} catch (e) {
		console.error(e);
		console.log(logToFile(e));
		searchedPapers = [];
	}
	return searchedPapers;
}

export const insertTestPaper = async (acmPaper: AcmPaper): Promise<AcmPaper> =>
	// @ts-ignore
	prisma.paper.create({
		data: {
			AcmPaper: {
				connectOrCreate: {
					create: {
						type: acmPaper.type,
						title: acmPaper.title,
						authors: acmPaper.authors,
						fullAuthors: acmPaper.fullAuthors,
						doi: acmPaper.doi,
						url: acmPaper.url,
						preprint: acmPaper.preprint,
						shortAbstract: acmPaper.shortAbstract,
						fullAbstract: acmPaper.fullAbstract,
						monthYear: acmPaper.monthYear,
						pages: acmPaper.pages,
						citations: acmPaper.citations,
						downloads: acmPaper.downloads,
						source: acmPaper.source,
					},
					where: {
						doi: acmPaper.doi,
					},
				},
			},
		},
	});

/*
export const getPaper = (paperId: number): Paper => {
	papers = getPapers();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return papers.find((paper) => paper.id === paperId);
}; */
