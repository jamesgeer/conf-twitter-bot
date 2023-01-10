import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { validSessionCookie, validUserLogin } from './sessions-model';
import { accountExists } from '../accounts/accounts-model';
import { ServerError } from '../types';
import { handleServerError } from '../util';

export const userSession = async (ctx: ParameterizedContext): Promise<void> => {
	// if no session exists or isLoggedIn is false then user not logged in
	if (!ctx.session || ctx.session.isNew || !ctx.session.isLoggedIn) {
		ctx.status = HttpStatus.UNAUTHORIZED;
		ctx.body = { message: 'You are not logged in.' };
		return;
	}

	// check if user has a valid session cookie
	const requestCookie = ctx.request.header.cookie;
	const sessionCookie = ctx.cookies.get('ConfTwBot');
	if (requestCookie && sessionCookie && !validSessionCookie(requestCookie, sessionCookie)) {
		ctx.status = HttpStatus.UNAUTHORIZED;
		ctx.body = { message: 'Invalid session cookie.' };
		return;
	}

	// checks passed, user is logged in
	ctx.status = HttpStatus.OK;
	ctx.body = ctx.session.userId;
};

export const userLogin = async (ctx: ParameterizedContext): Promise<void> => {
	const { username, password }: { username: string; password: string } = ctx.request.body;

	const userId = await validUserLogin(username, password);
	if (userId instanceof ServerError) {
		handleServerError(ctx, userId);
		return;
	}

	// koa-session needs to be running to create/store session cookie
	if (!ctx.session) {
		ctx.body = { error: 'Session could not be established' };
		ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
		return;
	}

	// save login session
	ctx.session.isLoggedIn = true;
	ctx.session.userId = userId;
	ctx.session.save();
	ctx.session.manuallyCommit();

	// return success (contains http cookie for ConfTwBot)
	ctx.status = HttpStatus.OK;
	ctx.body = userId;
};

export const userLogout = async (ctx: ParameterizedContext): Promise<void> => {
	// attempting to log out when not logged in, unauthorised
	if (ctx.session && !ctx.session.isLoggedIn) {
		ctx.status = HttpStatus.UNAUTHORIZED;
		return;
	}

	// destroy session by resetting variables
	if (ctx.session) {
		ctx.session.isLoggedIn = false;
		ctx.session.userId = undefined;
		ctx.session.accountId = undefined;
		ctx.session.twitterUserId = undefined;
	}

	// no content to respond with
	ctx.status = HttpStatus.NO_CONTENT;
};

export const accountSession = async (ctx: ParameterizedContext): Promise<void> => {
	if (ctx.session && ctx.session.isLoggedIn && ctx.session.userId) {
		ctx.status = HttpStatus.OK;
		ctx.body = ctx.session.userId;
		return;
	}

	// user is not logged in
	ctx.status = HttpStatus.UNAUTHORIZED;
};

interface AccountLoginRequest {
	accountId: string;
	userId: string;
	twitterUserId: string;
}

export const accountLogin = async (ctx: ParameterizedContext): Promise<void> => {
	if (ctx.session && !ctx.session.isLoggedIn) {
		ctx.status = HttpStatus.UNAUTHORIZED;
		ctx.body = { message: 'You must be logged in.' };
		return;
	}

	const { accountId, userId, twitterUserId }: AccountLoginRequest = ctx.request.body;

	if (await accountExists(+userId, BigInt(twitterUserId))) {
		// checks passed, store account details in session
		if (ctx.session) {
			ctx.session.userId = +userId;
			ctx.session.accountId = +accountId;
			ctx.session.twitterUserId = BigInt(twitterUserId);
		}

		ctx.status = HttpStatus.OK;
		return;
	}

	ctx.status = HttpStatus.NOT_FOUND;
	ctx.body = { message: 'Account does not exist.' };
};
