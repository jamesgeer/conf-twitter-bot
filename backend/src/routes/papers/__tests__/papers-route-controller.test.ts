import supertest from 'supertest';
import http from 'http';
import HttpStatus from 'http-status';
import { app } from '../../../app';
import { insertPaper } from '../papers-model';
import { Paper } from '../papers';
import prisma from '../../../../lib/prisma';

const request = supertest(http.createServer(app.callback()));

const papersEndpoint = '/api/papers';

beforeAll(async () => {
	await prisma.paper.deleteMany({});
});

afterAll(async () => {
	await prisma.paper.deleteMany({});
});

let paper: Paper;

it('GET papers should return an empty array', async () => {
	const response = await request.get(papersEndpoint);

	expect(response.status).toEqual(HttpStatus.OK);
	expect(response.body).toEqual([]);
});

it('GET papers should return an array with one paper', async () => {
	const testPaper: Paper = {
		type: 'type',
		title: 'javascript rocks',
		authors: ['authors'],
		fullAuthors: 'author',
		doi: 'doi',
		url: 'url',
		shortAbstract: 'blah blah blah',
		source: 'source',
	};
	paper = await insertPaper(testPaper);
	if (paper.scrapeDate instanceof Date) {
		paper.scrapeDate = paper.scrapeDate.toISOString();
	}

	const response = await request.get(papersEndpoint);
	console.log(response.body);
	expect(response.status).toEqual(HttpStatus.OK);
	expect(response.body).toEqual([paper]);
});

it('GET search paper should return paper matching result', async () => {
	const response = await request.get(papersEndpoint).query({ search: 'javascript' });

	expect(response.status).toEqual(HttpStatus.OK);
	expect(response.body).toEqual([paper]);
});

it('GET search paper should return an empty array as no results match query', async () => {
	const response = await request.get(`${papersEndpoint}/filter`).query({ search: 'beans' });

	expect(response.status).toEqual(HttpStatus.OK);
	expect(response.body).toEqual([]);
});
