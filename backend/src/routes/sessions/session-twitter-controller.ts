import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { accountExists } from '../accounts/accounts-model';

export const getActiveTwitterUser = async (ctx: ParameterizedContext): Promise<void> => {
	if (ctx.session.isLoggedIn && ctx.session.userId) {
		ctx.status = HttpStatus.OK;
		ctx.body = ctx.session.userId;
		return;
	}

	// user is not logged in
	ctx.status = HttpStatus.UNAUTHORIZED;
};

export const setActiveTwitterUser = async (ctx: ParameterizedContext): Promise<void> => {
	if (!ctx.session.isLoggedIn) {
		ctx.status = HttpStatus.UNAUTHORIZED;
		ctx.body = { message: 'You must be logged in.' };
		return;
	}

	const { userId } = ctx.params;
	const stringOnlyContainsNumbers = (str: string): boolean => /^\d+$/.test(str);

	if (!stringOnlyContainsNumbers(userId)) {
		ctx.status = HttpStatus.UNAUTHORIZED;
		ctx.body = { message: 'Invalid username.' };
		return;
	}

	if (!accountExists(userId)) {
		ctx.status = HttpStatus.NOT_FOUND;
		ctx.body = { message: 'Unable to locate user.' };
		return;
	}

	// checks passed, set user to active
	ctx.session.userId = userId;
	ctx.status = HttpStatus.OK;
};
