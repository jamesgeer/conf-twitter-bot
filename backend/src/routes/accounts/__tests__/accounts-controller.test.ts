// eslint-disable-next-line node/no-unpublished-import
import supertest from 'supertest';
import http from 'http';
import HttpStatus from 'http-status';
import { app } from '../../../app';

const apptest = supertest(http.createServer(app.callback()));

test('get account route should return 404/not found', async () => {
	const response = await apptest.get('/api/accounts/1');
	expect(response.status).toEqual(HttpStatus.NOT_FOUND);
	expect(response.body).toEqual({ message: 'Account not found.' });
});
