import { Prisma } from '@prisma/client';
import HttpStatus from 'http-status';
import { Paper, Papers, PaperSearchDB } from './papers';
import { logToFile } from '../../logging/logging';
import prisma from '../../../lib/prisma';
import { ServerError } from '../types';

export async function getPapers(): Promise<Papers> {
	try {
		// get all Acm papers and all Researchr papers
		// https://github.com/prisma/prisma/discussions/4136 would be useful, but not possible here :(
		return await prisma.paper.findMany({});
	} catch (e) {
		console.error(e);
		console.log(logToFile(e));
		return [];
	}
}

export async function getSearchedPapers(params: PaperSearchDB): Promise<Papers | []> {
	try {
		return await prisma.paper.findMany({
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
		});
	} catch (e) {
		console.error(e);
		console.log(logToFile(e));
		return [];
	}
}

export const insertPaper = async (paper: Paper): Promise<Paper> =>
	prisma.paper.create({
		data: paper,
	});

export interface UpdatePaperType {
	doi?: string;
	type?: string;
	title?: string;
	authors?: string[];
	fullAuthors?: string;
	url?: string;
	preprint?: string;
	shortAbstract?: string;
	fullAbstract?: string;
	monthYear?: string;
	pages?: string;
	citations?: number;
	downloads?: number;
	source?: string;
}

export const updatePaper = async (paperId: number, updateData: UpdatePaperType): Promise<Paper | ServerError> => {
	try {
		return await prisma.paper.update({
			where: {
				id: paperId,
			},
			data: {
				doi: updateData.doi || undefined,
				type: updateData.type || undefined,
				title: updateData.title || undefined,
				authors: updateData.authors || undefined,
				fullAuthors: updateData.fullAuthors || undefined,
				url: updateData.url || undefined,
				preprint: updateData.preprint || undefined,
				shortAbstract: updateData.shortAbstract || undefined,
				fullAbstract: updateData.fullAbstract || undefined,
				monthYear: updateData.monthYear || undefined,
				pages: updateData.pages || undefined,
				citations: updateData.citations || undefined,
				downloads: updateData.downloads || undefined,
				source: updateData.source || undefined,
			},
		});
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			return new ServerError(HttpStatus.NOT_FOUND, `Paper with ID ${paperId} not found.`);
		}
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to update tweet due to server problem.');
	}
};
