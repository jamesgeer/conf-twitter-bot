import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getPapers, getSearchedPapers } from './papers-model';
import { PaperSearch, PaperSearchDB, PaperSearchOld } from './papers';

export const papers = async (ctx: ParameterizedContext): Promise<void> => {
	console.log('papers run');
	const papers = await getPapers();

	ctx.status = HttpStatus.OK;
	ctx.body = papers;
};

export const searchedPapers = async (ctx: ParameterizedContext): Promise<void> => {
	console.log('searchedPapers run');
	const obj: PaperSearchOld = { ...ctx.request.query };

	const { search, year, source } = obj;
	const queryForDb: PaperSearchDB = { title: search, monthYear: year, source };

	const papers = await getSearchedPapers(queryForDb);

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
