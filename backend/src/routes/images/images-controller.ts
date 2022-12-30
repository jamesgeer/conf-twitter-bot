import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import send from 'koa-send';
import { ServerError } from '../types';
import { handleServerError } from '../util';
import { deleteImageDb, deleteImageFile, getImage, insertImage } from './images-model';

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

interface Image extends File {
	path: string;
}

// assign image(s) to tweet
export const attachImage = async (ctx: ParameterizedContext): Promise<void> => {
	const { images }: any = ctx.request.files;
	const { tweetId } = ctx.request.body;

	// if missing image(s) or tweet id then bad request
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

	for (const image of imgArray) {
		const { path } = image as Image;
		const result = await insertImage(tweetId, image.name, path, '');

		if (result instanceof ServerError) {
			handleServerError(ctx, result);
			// delete uploaded image if unable to insert into db
			await deleteImageFile(path);
			return;
		}
	}

	ctx.status = HttpStatus.OK;
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
};
