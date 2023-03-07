import HttpStatus from 'http-status';
import { faker } from '@faker-js/faker';
import { deletePaper, getPaper, getPapers, insertPaper, updatePaper } from '../papers-model';
import { Paper, Papers } from '../papers';
import prisma from '../../../../lib/prisma';
import { ServerError } from '../../types';

beforeAll(async () => {
	await prisma.paper.deleteMany({});
});

afterAll(async () => {
	await prisma.paper.deleteMany({});
});

let paper: Paper;

it('inserting a paper should return a paper', async () => {
	const testPaper: Paper = {
		type: 'research-article',
		title: 'typescript is bananas',
		authors: ['jim', 'joe', 'jane'],
		fullAuthors: '',
		doi: 'https://doi.org/55.5555/7777777.7777777',
		url: faker.internet.url(),
		shortAbstract: faker.lorem.lines(2),
		source: 'acm',
	};
	const result = <Paper>await insertPaper(testPaper);

	expect(result.id).toBeGreaterThan(0);
	expect(result.title).toEqual(testPaper.title);

	paper = result;
});

it('get papers should return an array containing the inserted paper', async () => {
	const results = <Papers>await getPapers();

	expect(results.length).toBeGreaterThanOrEqual(1);
	const result = results.some((result) => result.id === paper.id && result.title === paper.title);
	expect(result).toBeTruthy();
});

it('update paper should return paper with updated fields', async () => {
	const updatedFields = {
		title: 'cheese plumbs blueberries',
		source: 'abc',
	};

	const paperId = paper.id ? paper.id : 0;
	const result = <Paper>await updatePaper(paperId, updatedFields);
	expect(result.id).toEqual(paper.id);
	expect(result.title).toEqual('cheese plumbs blueberries');
	expect(result.source).toEqual('abc');

	paper = result;
});

it('get paper with id should return paper', async () => {
	const paperId = paper.id ? paper.id : 0;
	const result = <Paper>await getPaper(paperId);

	expect(result).toEqual(paper);
});

it('delete paper should return deleted paper', async () => {
	const paperId = paper.id ? paper.id : 0;
	const result = <Paper>await deletePaper(paperId);

	expect(result).toEqual(paper);
});

it('get deleted paper should not found error', async () => {
	const paperId = paper.id ? paper.id : 0;
	const result = <ServerError>await getPaper(paperId);

	expect(result.getStatusCode()).toEqual(HttpStatus.NOT_FOUND);
});
