import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';

const account = async (ctx: ParameterizedContext): Promise<void> => {
	console.log('NOT IMPLEMENTED');
	ctx.status = HttpStatus.OK;
};

const accounts = async (ctx: ParameterizedContext): Promise<void> => {
	console.log('NOT IMPLEMENTED');
	ctx.status = HttpStatus.OK;
};

export { account, accounts };
