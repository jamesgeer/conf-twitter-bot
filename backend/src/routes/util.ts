import { ParameterizedContext } from 'koa';
import path from 'path';
import appRoot from 'app-root-path';
import { ServerError } from './types';

export const handleServerError = (ctx: ParameterizedContext, result: ServerError): void => {
	ctx.status = result.getStatusCode();
	ctx.body = { message: result.getMessage() };
};

export const uploadFolder = path.join(appRoot.path, 'public', 'uploads');
