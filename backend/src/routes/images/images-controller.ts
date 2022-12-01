import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { ServerError } from '../types';
import { handleServerError } from '../util';
import { deleteImage, getImage } from './images-model';

export const tweetImage = async (ctx: ParameterizedContext): Promise<void> => {
	const { id } = ctx.params;
	const result = await getImage(id);
	if (result instanceof ServerError) {
		handleServerError(ctx, result);
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = result;
};

export const attachImage = async (ctx: ParameterizedContext): Promise<void> => {
	const { files } = ctx.request;
	// console.log(files);

	// @ts-ignore
	if (files.images) {
		// @ts-ignore
		for (const file of files.images) {
			console.log(file.path);
			console.log(file.name);
			console.log(file.type);
		}
	}
};

export const removeImage = async (ctx: ParameterizedContext): Promise<void> => {
	const { id } = ctx.params;
	const result = await deleteImage(id);
	if (result instanceof ServerError) {
		ctx.status = result.getStatusCode();
		ctx.body = { message: result.getMessage() };
		return;
	}

	ctx.status = HttpStatus.OK;
};
