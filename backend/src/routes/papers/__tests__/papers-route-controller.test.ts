import supertest from 'supertest';
import http from 'http';
import HttpStatus from 'http-status';
import { app } from '../../../app';
import { insertTestPaper } from '../papers-model';
import { AcmPaper } from '../papers';
import prisma from '../../../../lib/prisma';

const request = supertest(http.createServer(app.callback()));

const papersEndpoint = '/api/papers';

beforeAll(async () => {
	await prisma.acmPaper.deleteMany({});
	await prisma.researchrPaper.deleteMany({});
});

afterAll(async () => {
	await prisma.acmPaper.deleteMany({});
	await prisma.researchrPaper.deleteMany({});
});

let paper: AcmPaper;

it('GET papers should return an empty array', async () => {
	const response = await request.get(papersEndpoint);

	expect(response.status).toEqual(HttpStatus.OK);
	expect(response.body).toEqual([]);
});

it('GET papers should return an array with one paper', async () => {
	const testPaper: AcmPaper = {
		type: 'type',
		title: 'javascript rocks',
		authors: ['authors'],
		fullAuthors: 'author',
		doi: 'doi',
		url: 'url',
		shortAbstract: 'blah blah blah',
		source: 'source',
	};
	paper = await insertTestPaper(testPaper);
	console.log(paper);
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
