import { ParameterizedContext } from 'koa';
import * as fs from 'fs';
import { ServerError } from './types';

export const handleServerError = (ctx: ParameterizedContext, result: ServerError): void => {
	ctx.status = result.getStatusCode();
	ctx.body = { message: result.getMessage() };
};

export const readImage = (imagePath: string): any =>
	fs.readFile(imagePath, (err, image) => {
		if (err) {
			return;
		}

		console.log(image);
		// eslint-disable-next-line consistent-return
		return image;
	});
