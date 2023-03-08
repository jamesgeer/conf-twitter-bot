import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import {
	deletePaper,
	getAuthorsPapers,
	getPaper,
	getPapers,
	getSearchedPapers,
	updatePaper,
	UpdatePaperType,
} from './papers-model';
import { PaperSearchDB } from './papers';
import { ServerError } from '../types';
import { handleServerError } from '../util';
import { getSummary } from '../openai/openai-controller';

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
	if (papers instanceof ServerError) {
		ctx.status = papers.getStatusCode();
		ctx.body = { message: papers.getMessage() };
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = papers;
};

export const summariseAbstract = async (ctx: ParameterizedContext): Promise<void> => {
	const { id }: { id: string } = ctx.params;

	const paper = await getPaper(+id);
	if (paper instanceof ServerError) {
		ctx.status = paper.getStatusCode();
		ctx.body = { message: paper.getMessage() };
		return;
	}

	const summaryOfAbstract = await getSummary(paper.shortAbstract);
	if (summaryOfAbstract instanceof ServerError) {
		ctx.status = summaryOfAbstract.getStatusCode();
		ctx.body = { message: summaryOfAbstract.getMessage() };
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = summaryOfAbstract;
};

interface AuthorParams {
	paperId: string;
	authorIndex: string;
}

export const authorsPapers = async (ctx: ParameterizedContext): Promise<void> => {
	// @ts-ignore Dict error unknown reason
	const { paperId, authorIndex }: AuthorParams = ctx.request.query;

	const paper = await getPaper(+paperId);
	if (paper instanceof ServerError) {
		ctx.status = paper.getStatusCode();
		ctx.body = { message: paper.getMessage() };
		return;
	}

	const author = paper.authors[+authorIndex];
	if (+authorIndex > author.length) {
		ctx.status = HttpStatus.NOT_FOUND;
		return;
	}

	const authorPapers = await getAuthorsPapers(author);
	if (authorPapers instanceof ServerError) {
		ctx.status = authorPapers.getStatusCode();
		ctx.body = { message: authorPapers.getMessage() };
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = authorPapers;
};
