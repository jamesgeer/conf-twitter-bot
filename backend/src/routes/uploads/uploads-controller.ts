import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import send from 'koa-send';
import { ServerError } from '../types';
import { handleServerError } from '../util';
import { getUpload, getUploads, insertUpload, deleteUploadDb, deleteUploadFile } from './uploads-model';
import { Upload } from './uploads';

// upload by id
export const upload = async (ctx: ParameterizedContext): Promise<void> => {
	const { id } = ctx.params;
	const result = await getUpload(id);
	if (result instanceof ServerError) {
		handleServerError(ctx, result);
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = result;
	// await send(ctx, result.path, { root: '/' });
};

// retrieve tweet uploaded media
export const uploads = async (ctx: ParameterizedContext): Promise<void> => {
	const { tweetId } = ctx.params;

	if (!tweetId) {
		ctx.status = HttpStatus.BAD_REQUEST;
		ctx.body = 'Missing or invalid Tweet id';
		return;
	}

	const result = await getUploads(tweetId);
	if (result instanceof ServerError) {
		handleServerError(ctx, result);
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = result;
};

interface MediaUpload extends File {
	name: string;
	path: string;
}

// assign uploaded media to tweet
export const createUpload = async (ctx: ParameterizedContext): Promise<void> => {
	const { media }: any = ctx.request.files;
	const { tweetId } = ctx.request.body;

	// missing media or tweet id then bad request
	if (!media || !tweetId) {
		ctx.status = HttpStatus.BAD_REQUEST;
		return;
	}

	// required as a single image cannot be iterated over
	let uploadArray: File[] = [];
	if (Array.isArray(media)) {
		uploadArray = media;
	} else {
		uploadArray.push(media);
	}

	// iterate over uploaded media
	const results: Upload[] = [];
	for (const mediaUpload of uploadArray) {
		const { name, path } = mediaUpload as MediaUpload;
		const result = await insertUpload(tweetId, name, path, '', 'image');

		// delete uploaded image if database insertion fails
		if (result instanceof ServerError) {
			handleServerError(ctx, result);
			await deleteUploadFile(path);
			return;
		}

		results.push(result);
	}

	ctx.status = HttpStatus.OK;
	ctx.body = results;
};

// remove image from database and file system
export const removeUpload = async (ctx: ParameterizedContext): Promise<void> => {
	const { id } = ctx.params;

	// delete image from database
	const result = await deleteUploadDb(id);
	if (result instanceof ServerError) {
		handleServerError(ctx, result);
		return;
	}

	// only attempt to delete image if successfully removed from database
	await deleteUploadFile(result.path);

	ctx.status = HttpStatus.OK;
	ctx.body = result;
};
