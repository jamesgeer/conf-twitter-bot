import supertest from 'supertest';
import http from 'http';
import HttpStatus from 'http-status';
import { app } from '../../../app';
import { insertTestPaper, TestPaper } from '../papers-model';
import { Paper } from '../papers';
import prisma from '../../../../lib/prisma';

const request = supertest(http.createServer(app.callback()));

const papersEndpoint = '/api/papers';

let paper: Paper;

beforeAll(async () => {
	await prisma.paper.deleteMany({});
});

afterAll(async () => {
	await prisma.paper.deleteMany({});
});

it('GET papers should return an empty array', async () => {
	const response = await request.get(papersEndpoint);

	expect(response.status).toEqual(HttpStatus.OK);
	expect(response.body).toEqual([]);
});

it('GET papers should return an array with one paper', async () => {
	const testPaper: TestPaper = {
		type: 'type',
		title: 'javascript rocks',
		authors: 'authors',
		doi: 'doi',
		url: 'url',
		shortAbstract: 'blah blah blah',
	};
	paper = await insertTestPaper(testPaper);

	const response = await request.get(papersEndpoint);

	expect(response.status).toEqual(HttpStatus.OK);
	expect(response.body).toEqual([paper]);
});

it('GET search paper should return paper matching result', async () => {
	const response = await request.get(papersEndpoint).query({ search: 'javascript' });
	console.log(response);

	expect(response.status).toEqual(HttpStatus.OK);
	expect(response.body).toEqual([paper]);
});

it('GET search paper should return an empty array as no results match query', async () => {
	const response = await request.get(papersEndpoint).query({ search: 'beans' });

	expect(response.status).toEqual(HttpStatus.OK);
	expect(response.body).toEqual([]);
});
