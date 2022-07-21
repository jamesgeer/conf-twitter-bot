import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { validSessionCookie } from '../models/session-model';

export const isLoggedIn = async (ctx: ParameterizedContext): Promise<void> => {
	// if no session exists or isLoggedIn is false then user not logged in
	if (!ctx.session || ctx.session.isNew || !ctx.session.isLoggedIn) {
		ctx.status = HttpStatus.OK;
		ctx.body = { loggedIn: false };
		return;
	}

	// check if user has a valid session cookie
	const requestCookie = ctx.request.header.cookie;
	const sessionCookie = ctx.cookies.get('ConfTwBot');
	if (validSessionCookie(requestCookie, sessionCookie)) {
		ctx.body = { loggedIn: true };
		ctx.status = HttpStatus.OK;
		return;
	}

	// invalid/no cookie/no session user is not logged in
	ctx.status = HttpStatus.OK;
	ctx.body = { loggedIn: false };
};

export const login = async (ctx: ParameterizedContext): Promise<void> => {
	console.log('NOT IMPLEMENTED');
};

export const logout = async (ctx: ParameterizedContext): Promise<void> => {
	console.log('NOT IMPLEMENTED');
};

export const isActiveTwitterAccount = async (ctx: ParameterizedContext): Promise<void> => {
	console.log('NOT IMPLEMENTED');
};

export const activeTwitterAccount = async (ctx: ParameterizedContext): Promise<void> => {
	console.log('NOT IMPLEMENTED');
};
