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

describe('paper endpoint get operations', () => {
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
		expect(response.status).toEqual(HttpStatus.OK);
		expect(response.body).toEqual([paper]);
	});

	it('GET paper with id should return paper', async () => {
		const response = await request.get(`${papersEndpoint}/${paper.id}`);

		expect(response.status).toEqual(HttpStatus.OK);
		expect(response.body).toEqual(paper);
	});
});

describe('search paper operations', () => {
	it('GET search paper should return paper matching result', async () => {
		const response = await request.get(`${papersEndpoint}/filter`).query({
			search: 'javascript',
		});

		expect(response.status).toEqual(HttpStatus.OK);
		expect(response.body).toEqual([paper]);
	});

	it('GET search paper should return an empty array as no results match query', async () => {
		const response = await request.get(`${papersEndpoint}/filter`).query({
			search: 'beans',
		});

		expect(response.status).toEqual(HttpStatus.OK);
		expect(response.body).toEqual([]);
	});
});

describe('paper endpoint update operations', () => {
	it('PATCH paper with id should return paper', async () => {
		const payload = {
			title: 'Can you trust Javascript?',
			fullAbstract: 'In the before times, C was the language of choice...',
		};

		const response = await request.patch(`${papersEndpoint}/${paper.id}`).send(payload);
		const result: Paper = response.body;

		expect(response.status).toEqual(HttpStatus.OK);
		expect(result.id).toEqual(paper.id);
		expect(result.title).toEqual(payload.title);
		expect(result.fullAbstract).toEqual(payload.fullAbstract);

		paper = result;
	});

	it('GET paper with id should return updated paper', async () => {
		const response = await request.get(`${papersEndpoint}/${paper.id}`);

		expect(response.status).toEqual(HttpStatus.OK);
		expect(response.body).toEqual(paper);
	});
});

describe('paper endpoint delete operations', () => {
	it('DELETE paper with id should return updated paper', async () => {
		const response = await request.delete(`${papersEndpoint}/${paper.id}`);

		expect(response.status).toEqual(HttpStatus.OK);
	});

	it('DELETE/GET deleted paper with id should return not found error', async () => {
		const deleteResponse = await request.delete(`${papersEndpoint}/${paper.id}`);
		const getResponse = await request.get(`${papersEndpoint}/${paper.id}`);

		expect(deleteResponse.status).toEqual(HttpStatus.NOT_FOUND);
		expect(getResponse.status).toEqual(HttpStatus.NOT_FOUND);
	});
});
