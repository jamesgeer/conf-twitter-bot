import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import path from 'path';
import { ServerError } from '../types';
import { handleServerError } from '../util';
import { getUpload, getUploads, insertUpload, deleteUploadDb, deleteUploadFile } from './uploads-model';
import { Upload } from './uploads';
import { APP_URL } from '../../keys';

// upload by id
export const upload = async (ctx: ParameterizedContext): Promise<void> => {
	const { id }: { id: string } = ctx.params;
	const uploadId: number = +id;

	if (uploadId <= 0) {
		ctx.status = HttpStatus.BAD_REQUEST;
		return;
	}

	const result = await getUpload(uploadId);
	if (result instanceof ServerError) {
		handleServerError(ctx, result);
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = result;
};

// retrieve tweet uploaded media
export const uploads = async (ctx: ParameterizedContext): Promise<void> => {
	const { id }: { id: string } = ctx.params;
	const tweetId = +id;

	if (tweetId <= 0) {
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
		const filename = path.basename((mediaUpload as MediaUpload).path);

		const upload: Upload = {
			id: 0,
			tweetId: +tweetId,
			name: filename,
			url: `${APP_URL}/uploads/${filename}`,
			alt: '',
			type: mediaUpload.type,
		};

		const result = await insertUpload(upload);

		// delete uploaded image if database insertion fails
		if (result instanceof ServerError) {
			handleServerError(ctx, result);
			await deleteUploadFile(filename);
			return;
		}

		results.push(result);
	}

	ctx.status = HttpStatus.OK;
	ctx.body = results;
};

// remove image from database and file system
export const removeUpload = async (ctx: ParameterizedContext): Promise<void> => {
	const { id }: { id: string } = ctx.params;
	const uploadId: number = +id;

	if (uploadId <= 0) {
		ctx.status = HttpStatus.BAD_REQUEST;
		return;
	}

	// delete image from database
	const result = await deleteUploadDb(uploadId);
	if (result instanceof ServerError) {
		handleServerError(ctx, result);
		return;
	}

	// only attempt to delete image if successfully removed from database
	await deleteUploadFile(result.name);

	ctx.status = HttpStatus.OK;
	ctx.body = result;
};
