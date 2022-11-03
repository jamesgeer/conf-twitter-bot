import { ParameterizedContext } from 'koa';
import { ServerError } from './types';

export const handleServerError = (ctx: ParameterizedContext, result: ServerError): void => {
	ctx.status = result.getStatusCode();
	ctx.body = { message: result.getMessage() };
};
