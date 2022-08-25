import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import * as dotenv from 'dotenv';
import { validSessionCookie } from './sessions-model';

dotenv.config({ path: '../../.env' });

export const isLoggedIn = async (ctx: ParameterizedContext): Promise<void> => {
	// if no session exists or isLoggedIn is false then user not logged in
	if (!ctx.session || ctx.session.isNew || !ctx.session.isLoggedIn) {
		ctx.status = HttpStatus.UNAUTHORIZED;
		ctx.body = { message: 'You are not logged in.' };
		return;
	}

	// check if user has a valid session cookie
	const requestCookie = ctx.request.header.cookie;
	const sessionCookie = ctx.cookies.get('ConfTwBot');
	if (!validSessionCookie(requestCookie, sessionCookie)) {
		ctx.status = HttpStatus.UNAUTHORIZED;
		ctx.body = { message: 'Invalid session cookie.' };
		return;
	}

	// checks passed, user is logged in
	ctx.status = HttpStatus.OK;
};

export const login = async (ctx: ParameterizedContext): Promise<void> => {
	// make sure request contains a body
	if (!ctx.request.body) {
		ctx.status = HttpStatus.BAD_REQUEST;
		ctx.body = { message: 'Missing request body' };
		return;
	}

	// duplicate code
	const requestCookie = ctx.request.header.cookie;
	const sessionCookie = ctx.cookies.get('ConfTwBot');

	// already logged in
	if (validSessionCookie(requestCookie, sessionCookie)) {
		ctx.status = HttpStatus.OK;
		return;
	}

	// response did not contain a valid cookie, perform password verification
	const { password } = ctx.request.body;
	if (password && password === process.env.APP_PASSWORD) {
		// koa-session needs to be running to create/store session cookie
		if (!ctx.session) {
			ctx.body = { error: 'Session could not be established' };
			ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
			return;
		}

		// save login session
		ctx.session.isLoggedIn = true;
		ctx.session.save();
		ctx.session.manuallyCommit();

		// return success (contains http cookie for ConfTwBot)
		ctx.status = HttpStatus.OK;
		ctx.body = { message: 'Login successful' };
		return;
	}

	// invalid login credentials
	ctx.status = HttpStatus.UNAUTHORIZED;
	ctx.body = { error: 'Invalid login' };
};

export const logout = async (ctx: ParameterizedContext): Promise<void> => {
	// attempting to log out when not logged in, unauthorised
	if (!ctx.session.isLoggedIn) {
		ctx.status = HttpStatus.UNAUTHORIZED;
		return;
	}

	// destroy session by resetting variables
	ctx.session.isLoggedIn = false;
	ctx.session.userId = undefined;

	// no content to respond with
	ctx.status = HttpStatus.NO_CONTENT;
};
