import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getPaper, getPapers, getSearchedPapers } from './papers-model';
import { PaperSearch, PaperSearchDB } from './papers';
import { ServerError } from '../types';
import { handleServerError } from '../util';

export const paper = async (ctx: ParameterizedContext): Promise<void> => {
	const { id }: { id: string } = ctx.params;
	const paperId = +id;

	const result = await getPaper(paperId);
	if (result instanceof ServerError) {
		handleServerError(ctx, result);
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = result;
};

export const papers = async (ctx: ParameterizedContext): Promise<void> => {
	const papers = await getPapers();

	ctx.status = HttpStatus.OK;
	ctx.body = papers;
};

export const searchedPapers = async (ctx: ParameterizedContext): Promise<void> => {
	const obj: PaperSearch = { ...ctx.request.query };

	const { search, source } = obj;
	const queryForDb: PaperSearchDB = { title: search, source };

	const papers = await getSearchedPapers(queryForDb);

	ctx.status = HttpStatus.OK;
	ctx.body = papers;
};

export const updatePaper = async (ctx: ParameterizedContext): Promise<void> => {
	// const { id } = ctx.params;
	// const { title, content } = ctx.request.body;

	ctx.status = HttpStatus.OK;
	ctx.body = '';
};
