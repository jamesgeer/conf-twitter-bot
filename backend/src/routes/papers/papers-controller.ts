import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getPapers, getSearchedPapers } from './papers-model';
import { PaperSearch, PaperSearchDB } from './papers';

export const papers = async (ctx: ParameterizedContext): Promise<void> => {
	const papers = await getPapers();

	ctx.status = HttpStatus.OK;
	ctx.body = papers;
};

export const searchedPapers = async (ctx: ParameterizedContext): Promise<void> => {
	console.log('cheesecake');
	// @ts-ignore
	const {
		payload: { search, year, conference },
	}: PaperSearch = ctx.request.query;

	// console.log(ctx.request.query);
	// console.log(ctx.request.query.payload);

	// console.log(`current: ${search} + ${year} + ${conference}`);
	const params: PaperSearchDB = { title: search, monthYear: year, conference };
	// console.log(`vars: + ${title} + ${monthYear} + ${conference}`);
	// const queryForDb: PaperSearchDB = { title: search, monthYear: year, conference };
	// console.log(`queryForDb: + ${queryForDb.title} + ${queryForDb.monthYear} + ${queryForDb.conference}`);
	const papers = await getSearchedPapers(params);

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
