import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getAuthorsPapers, getPapers, getSearchedPapers } from './papers-model';
import { PaperSearch, PaperSearchDB } from './papers';

export const papers = async (ctx: ParameterizedContext): Promise<void> => {
	// console.log('papers run');
	const papers = await getPapers();

	ctx.status = HttpStatus.OK;
	ctx.body = papers;
};

export const searchedPapers = async (ctx: ParameterizedContext): Promise<void> => {
	// console.log('searchedPapers run');
	const obj: PaperSearch = { ...ctx.request.query };

	const { search, source } = obj;
	const queryForDb: PaperSearchDB = { title: search, source };

	const papers = await getSearchedPapers(queryForDb);

	ctx.status = HttpStatus.OK;
	ctx.body = papers;
};

export const authorsPapers = async (ctx: ParameterizedContext): Promise<void> => {
	const { author }: { author: string } = ctx.params;

	// unhandled case with - in name
	const authorFormatted = author.replace(/-/g, ' ');
	const name = authorFormatted.split(' ');

	for (let i = 0; i < name.length; i++) {
		name[i] = name[i][0].toUpperCase() + name[i].substring(1);
	}

	const authorParam = name.join(' ');

	const papers = await getAuthorsPapers(authorParam);

	ctx.status = HttpStatus.OK;
	ctx.body = papers;
};
/*
export const paper = async (ctx: ParameterizedContext): Promise<void> => {
	const { paperId } = ctx.params;
	const paper = getPaper(parseInt(paperId, 10));

	if (paper) {
		ctx.status = HttpStatus.OK;
		ctx.body = paper;
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = { message: 'No paper with that ID exists.' };
}; */
