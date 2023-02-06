import HttpStatus from 'http-status';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { existsSync, rmSync } from 'fs';
import path from 'path';
import { ServerError } from '../types';
import prisma from '../../../lib/prisma';
import { logToFile } from '../../logging/logging';
import { Upload, Uploads } from './uploads';
import { uploadFolder } from '../util';

export const getUpload = async (uploadId: number): Promise<Upload | ServerError> => {
	try {
		const result = await prisma.upload.findUnique({
			where: {
				id: uploadId,
			},
		});
		if (result) {
			return result;
		}
		return new ServerError(HttpStatus.NOT_FOUND, `Image with ID ${uploadId} not found.`);
	} catch (e) {
		console.log(e);
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to get image due to server problem.');
	}
};

export const getUploads = async (tweetId: number): Promise<Uploads | ServerError> => {
	try {
		return await prisma.upload.findMany({
			where: {
				tweetId,
			},
		});
	} catch (e) {
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to get uploads due to server problem.');
	}
};

export const insertUpload = async (upload: Upload): Promise<Upload | ServerError> => {
	const { tweetId, name, url, alt, type } = upload;

	try {
		return await prisma.upload.create({
			data: {
				tweetId,
				name,
				url,
				alt,
				type,
			},
		});
	} catch (e) {
		console.log(e);
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to insert upload due to server problem.');
	}
};

// remove image from database
export const deleteUploadDb = async (imageId: number): Promise<Upload | ServerError> => {
	console.log(imageId);
	try {
		return await prisma.upload.delete({
			where: {
				id: imageId,
			},
		});
	} catch (e) {
		console.log(e);
		if (e instanceof PrismaClientKnownRequestError) {
			return new ServerError(
				HttpStatus.NOT_FOUND,
				`Image with ID ${imageId} not found: either already deleted or received incorrect/invalid ID.`,
			);
		}
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to delete image due to server problem.');
	}
};

// remove uploaded file
export const deleteUploadFile = async (fileName: string): Promise<void> =>
	rmSync(path.join(uploadFolder, fileName), {
		// ignore exceptions i.e. file not found (try/catch does not prevent fs from crashing server)
		force: true,
	});

// check uploaded file exists
export const uploadFileExists = async (fileName: string): Promise<boolean> =>
	existsSync(path.join(uploadFolder, fileName));
