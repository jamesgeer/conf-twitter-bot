import { ParameterizedContext } from 'koa';
import path from 'path';
import appRoot from 'app-root-path';
import { ServerError } from './types';
import { TEST } from '../keys';

export const handleServerError = (ctx: ParameterizedContext, result: ServerError): void => {
	ctx.status = result.getStatusCode();
	ctx.body = { message: result.getMessage() };
};

// const folderName = TEST ? 'test-uploads' : 'uploads';
const folderName = TEST ? 'uploads' : 'uploads';
export const uploadFolder = path.join(appRoot.path, 'public', folderName);
