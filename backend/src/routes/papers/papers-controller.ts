import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getPapers } from './papers-model';
import { PaperSearch } from './papers';

export const papers = async (ctx: ParameterizedContext): Promise<void> => {
	const papers = await getPapers();

	ctx.status = HttpStatus.OK;
	ctx.body = papers;
};

export const searchedPapers = async (ctx: ParameterizedContext): Promise<void> => {
	// const params = ctx.request.query;
	// const params2 = ctx.request.query.payload;
	console.log('brandon was here!');
	console.log(ctx);
	// const papers = await getSearchedPapers(params);

	ctx.status = HttpStatus.OK;
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
