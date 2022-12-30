import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import send from 'koa-send';
import { ServerError } from '../types';
import { handleServerError } from '../util';
import { deleteImageDb, deleteImageFile, getImage, insertImage } from './images-model';
import { Image } from './images';

// retrieve image
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

interface ImageUpload extends File {
	name: string;
	path: string;
}

// assign image(s) to tweet
export const attachImage = async (ctx: ParameterizedContext): Promise<void> => {
	const { images }: any = ctx.request.files;
	const { tweetId } = ctx.request.body;

	// missing image(s) or tweet id then bad request
	if (!images || !tweetId) {
		ctx.status = HttpStatus.BAD_REQUEST;
		return;
	}

	// required as a single image cannot be iterated over
	let imgArray: File[] = [];
	if (Array.isArray(images)) {
		imgArray = images;
	} else {
		imgArray.push(images);
	}

	// iterate over uploaded images
	const results: Image[] = [];
	for (const image of imgArray) {
		const { name, path } = image as ImageUpload;
		const result = await insertImage(tweetId, name, path, '');

		// delete uploaded image if database insertion fails
		if (result instanceof ServerError) {
			handleServerError(ctx, result);
			await deleteImageFile(path);
			return;
		}

		results.push(result);
	}

	ctx.status = HttpStatus.OK;
	ctx.body = results;
};

// remove image from database and file system
export const removeImage = async (ctx: ParameterizedContext): Promise<void> => {
	const { id } = ctx.params;

	// delete image from database
	const result = await deleteImageDb(id);
	if (result instanceof ServerError) {
		handleServerError(ctx, result);
		return;
	}

	// only attempt to delete image if successfully removed from database
	await deleteImageFile(result.path);

	ctx.status = HttpStatus.OK;
	ctx.body = result;
};
