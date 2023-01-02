import HttpStatus from 'http-status';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as fs from 'fs';
import { ServerError } from '../types';
import prisma from '../../../lib/prisma';
import { logToFile } from '../../logging/logging';
import { Upload } from './uploads';

export const getTweetMedia = async (uploadId: string): Promise<Upload | ServerError> => {
	try {
		const result = await prisma.upload.findUnique({
			where: {
				id: +uploadId,
			},
		});
		if (result) {
			return result;
		}
		return new ServerError(HttpStatus.NOT_FOUND, `Image with ID ${uploadId} not found.`);
	} catch (e) {
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to get image due to server problem.');
	}
};

export const insertUpload = async (
	tweetId: string,
	name: string,
	path: string,
	alt: string,
	type: string,
): Promise<Upload | ServerError> => {
	console.log(`Attempting to insert: ${name}${path}`);
	try {
		return await prisma.upload.create({
			data: {
				tweetId: +tweetId,
				name,
				path,
				alt,
				type,
			},
		});
	} catch (e) {
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to insert upload due to server problem.');
	}
};

export const updateUploadName = async (uploadId: string, name: string): Promise<Upload | ServerError> => {
	try {
		return await prisma.upload.update({
			where: {
				id: +uploadId,
			},
			data: {
				name,
			},
		});
	} catch (e) {
		if (e instanceof PrismaClientKnownRequestError) {
			return new ServerError(HttpStatus.NOT_FOUND, `Upload with ID ${uploadId} not found.`);
		}
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to update tweet due to server problem.');
	}
};

export const updateUploadPath = async (uploadId: string, path: string): Promise<Upload | ServerError> => {
	try {
		return await prisma.upload.update({
			where: {
				id: +uploadId,
			},
			data: {
				path,
			},
		});
	} catch (e) {
		if (e instanceof PrismaClientKnownRequestError) {
			return new ServerError(HttpStatus.NOT_FOUND, `Upload with ID ${uploadId} not found.`);
		}
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to update tweet due to server problem.');
	}
};

export const updateUploadAlt = async (uploadId: string, alt: string): Promise<Upload | ServerError> => {
	try {
		return await prisma.upload.update({
			where: {
				id: +uploadId,
			},
			data: {
				alt,
			},
		});
	} catch (e) {
		if (e instanceof PrismaClientKnownRequestError) {
			return new ServerError(HttpStatus.NOT_FOUND, `Image with ID ${uploadId} not found.`);
		}
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to update tweet due to server problem.');
	}
};

// remove image from database
export const deleteUploadDb = async (imageId: string): Promise<Upload | ServerError> => {
	try {
		return await prisma.upload.delete({
			where: {
				id: +imageId,
			},
		});
	} catch (e) {
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

// remove image file
export const deleteUploadFile = async (filePath: string): Promise<void> =>
	fs.rmSync(filePath, {
		// ignore exceptions i.e. file not found (try/catch does not prevent fs from crashing server)
		force: true,
	});
