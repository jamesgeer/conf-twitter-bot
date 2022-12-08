import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import send from 'koa-send';
import { ServerError } from '../types';
import { handleServerError } from '../util';
import { deleteImage, getImage, insertImage } from './images-model';

export const tweetImage = async (ctx: ParameterizedContext): Promise<void> => {
	const { id } = ctx.params;
	const result = await getImage(id);
	if (result instanceof ServerError) {
		handleServerError(ctx, result);
		return;
	}

	ctx.status = HttpStatus.OK;
	await send(ctx, result.path, { root: '/' });
};

export const attachImage = async (ctx: ParameterizedContext): Promise<void> => {
	// @ts-ignore
	const { images } = ctx.request.files;
	const { tweetId } = ctx.request.body;

	if (!images || !tweetId) {
		ctx.status = HttpStatus.BAD_REQUEST;
		return;
	}

	let imgArray: File[] = [];

	if (Array.isArray(images)) {
		imgArray = images;
	} else {
		imgArray.push(images);
	}

	console.log(images);
	for (const image of imgArray) {
		console.log(image);
		// @ts-ignore
		const result = await insertImage(tweetId, image.name, image.path, '');
		console.log(result);

		if (result instanceof ServerError) {
			ctx.status = result.getStatusCode();
			ctx.body = { message: result.getMessage() };
			return;
		}
	}

	ctx.status = HttpStatus.OK;
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
