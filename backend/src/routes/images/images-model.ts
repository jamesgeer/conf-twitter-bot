import HttpStatus from 'http-status';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ServerError } from '../types';
import prisma from '../../../lib/prisma';
import { logToFile } from '../../logging/logging';
import { Image } from './images';

export const getImage = async (imageId: string): Promise<Image | ServerError> => {
	try {
		const result = await prisma.image.findUnique({
			where: {
				id: +imageId,
			},
		});
		if (result) {
			return result;
		}
		return new ServerError(HttpStatus.NOT_FOUND, `Image with ID ${imageId} not found.`);
	} catch (e) {
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to get image due to server problem.');
	}
};

export const insertImage = async (
	tweetId: string,
	name: string,
	path: string,
	alt: string,
): Promise<Image | ServerError> => {
	try {
		return await prisma.image.create({
			data: {
				tweetId: +tweetId,
				name,
				path,
				alt,
			},
		});
	} catch (e) {
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to insert image due to server problem.');
	}
};

export const updateImageName = async (imageId: string, name: string): Promise<Image | ServerError> => {
	try {
		return await prisma.image.update({
			where: {
				id: +imageId,
			},
			data: {
				name,
			},
		});
	} catch (e) {
		if (e instanceof PrismaClientKnownRequestError) {
			return new ServerError(HttpStatus.NOT_FOUND, `Image with ID ${imageId} not found.`);
		}
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to update tweet due to server problem.');
	}
};

export const updateImagePath = async (imageId: string, path: string): Promise<Image | ServerError> => {
	try {
		return await prisma.image.update({
			where: {
				id: +imageId,
			},
			data: {
				path,
			},
		});
	} catch (e) {
		if (e instanceof PrismaClientKnownRequestError) {
			return new ServerError(HttpStatus.NOT_FOUND, `Image with ID ${imageId} not found.`);
		}
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to update tweet due to server problem.');
	}
};

export const updateImageAlt = async (imageId: string, alt: string): Promise<Image | ServerError> => {
	try {
		return await prisma.image.update({
			where: {
				id: +imageId,
			},
			data: {
				alt,
			},
		});
	} catch (e) {
		if (e instanceof PrismaClientKnownRequestError) {
			return new ServerError(HttpStatus.NOT_FOUND, `Image with ID ${imageId} not found.`);
		}
		console.log(logToFile(e));
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to update tweet due to server problem.');
	}
};

export const deleteImage = async (imageId: string): Promise<Image | ServerError> => {
	try {
		return await prisma.image.delete({
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
