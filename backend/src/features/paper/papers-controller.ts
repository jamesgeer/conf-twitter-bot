import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { getPaper, getPapers } from './papers-model';

export const papers = async (ctx: ParameterizedContext): Promise<void> => {
	const papers = getPapers();

	ctx.status = HttpStatus.OK;
	ctx.body = papers;
};

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
};
