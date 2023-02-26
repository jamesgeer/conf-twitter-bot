import prisma from '../../../../lib/prisma';
import { getHistory, uploadScrapeHistoryToDatabase } from '../scraper-model';
import { ScrapeHistoryElm } from '../scraper';

beforeAll(async () => {
	await prisma.paper.deleteMany({});
	await prisma.scrapeHistory.deleteMany({});
});

afterAll(async () => {
	await prisma.paper.deleteMany({});
	await prisma.scrapeHistory.deleteMany({});
});

describe('tests for the scrape history model', () => {
	const url = 'https://www.google.com';
	const errors = 'No errors.';
	it('inserting a history element should return true', async () => {
		const errors = 'No errors.';
		const result = await uploadScrapeHistoryToDatabase(url, errors);

		expect(result).toBe(true);
	});

	it('getting history should return one element', async () => {
		const testRes: ScrapeHistoryElm = {
			links: url,
			errors,
			scrapeDate: '',
		};

		const result = await getHistory();

		expect(result.length).toBe(1);
		expect(result[0].links).toBe(testRes.links);
		expect(result[0].errors).toBe(testRes.errors);
	});
});
