import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import * as dotenv from 'dotenv';
import { validSessionCookie, validUserLogin } from './sessions-model';
import { accountExists } from '../accounts/accounts-model';
import { ServerError } from '../types';

dotenv.config({ path: '../../.env' });

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
	if (!validSessionCookie(requestCookie, sessionCookie)) {
		ctx.status = HttpStatus.UNAUTHORIZED;
		ctx.body = { message: 'Invalid session cookie.' };
		return;
	}

	// checks passed, user is logged in
	ctx.status = HttpStatus.OK;
};

export const userLogin = async (ctx: ParameterizedContext): Promise<void> => {
	const { username, password } = ctx.request.body;

	const validLogin = await validUserLogin(username, password);
	if (validLogin instanceof ServerError) {
		ctx.status = validLogin.getStatusCode();
		ctx.body = { message: validLogin.getMessage() };
		return;
	}

	if (!validLogin) {
		ctx.status = HttpStatus.UNAUTHORIZED;
		ctx.body = { error: 'Incorrect password' };
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
	ctx.session.save();
	ctx.session.manuallyCommit();

	// return success (contains http cookie for ConfTwBot)
	ctx.status = HttpStatus.OK;
	ctx.body = { message: 'Login successful' };
};

export const userLogout = async (ctx: ParameterizedContext): Promise<void> => {
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

export const accountSession = async (ctx: ParameterizedContext): Promise<void> => {
	if (ctx.session.isLoggedIn && ctx.session.userId) {
		ctx.status = HttpStatus.OK;
		ctx.body = ctx.session.userId;
		return;
	}

	// user is not logged in
	ctx.status = HttpStatus.UNAUTHORIZED;
};

export const accountLogin = async (ctx: ParameterizedContext): Promise<void> => {
	if (!ctx.session.isLoggedIn) {
		ctx.status = HttpStatus.UNAUTHORIZED;
		ctx.body = { message: 'You must be logged in.' };
		return;
	}

	const { userId } = ctx.request.body;
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