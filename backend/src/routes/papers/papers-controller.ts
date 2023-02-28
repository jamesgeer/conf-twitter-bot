import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { deletePaper, getPaper, getPapers, getSearchedPapers, updatePaper, UpdatePaperType } from './papers-model';
import { PaperSearchDB } from './papers';
import { ServerError } from '../types';
import { handleServerError } from '../util';

export const paper = async (ctx: ParameterizedContext): Promise<void> => {
	const { id }: { id: string } = ctx.params;

	const result = await getPaper(+id);
	if (result instanceof ServerError) {
		handleServerError(ctx, result);
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = result;
};

export const papers = async (ctx: ParameterizedContext): Promise<void> => {
	const result = await getPapers();
	if (result instanceof ServerError) {
		handleServerError(ctx, result);
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = result;
};

export const patchPaper = async (ctx: ParameterizedContext): Promise<void> => {
	const { id }: { id: string } = ctx.params;
	const updateData = ctx.request.body as UpdatePaperType;

	const result = await updatePaper(+id, updateData);
	if (result instanceof ServerError) {
		handleServerError(ctx, result);
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = result;
};

export const removePaper = async (ctx: ParameterizedContext): Promise<void> => {
	const { id }: { id: string } = ctx.params;

	const result = await deletePaper(+id);
	if (result instanceof ServerError) {
		ctx.status = result.getStatusCode();
		ctx.body = { message: result.getMessage() };
		return;
	}

	ctx.status = HttpStatus.OK;
};

interface PaperSearch {
	search?: string;
	source?: string;
}

export const searchedPapers = async (ctx: ParameterizedContext): Promise<void> => {
	const { search, source }: PaperSearch = ctx.request.query;
	const queryForDb: PaperSearchDB = { title: search, source };

	const papers = await getSearchedPapers(queryForDb);

	ctx.status = HttpStatus.OK;
	ctx.body = papers;
};
