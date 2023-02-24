import { ParameterizedContext } from 'koa';
import path from 'path';
import appRoot from 'app-root-path';
import { ServerError } from './types';
import { NODE_ENV, NODE_ENV_OPTIONS } from '../keys';

export const handleServerError = (ctx: ParameterizedContext, result: ServerError): void => {
	ctx.status = result.getStatusCode();
	ctx.body = { message: result.getMessage() };
};

const folderName = NODE_ENV === NODE_ENV_OPTIONS.TEST ? 'test-uploads' : 'uploads';
export const uploadFolder = path.join(appRoot.path, 'public', folderName);
