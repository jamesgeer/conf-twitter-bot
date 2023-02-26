import prisma from '../../../../lib/prisma';
import { getHistory, isAcmUrl, isRschrUrl, uploadScrapeHistoryToDatabase } from '../scraper-model';
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
	it('should not be possible to upload empty string', async () => {
		const result = await uploadScrapeHistoryToDatabase('', errors);

		expect(result).toBe(false);
	});
	it('should convert no errors to textual form', async () => {
		const result = await uploadScrapeHistoryToDatabase(url, '');
		const uploaded = await getHistory();
		expect(result).toBe(true);
		expect(uploaded[0].errors).toBe('No errors.');
	});
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

		expect(result.length).toBeGreaterThanOrEqual(1);
		expect(result[0].links).toBe(testRes.links);
		expect(result[0].errors).toBe(testRes.errors);
	});
});

describe('paper link conditional tests', () => {
	const acmUrl = 'https://dl.acm.org/doi/proceedings/10.1145/3475738';
	const rschrUrl = 'https://2022.splashcon.org/track/splash-2022-oopsla?#event-overview';
	const wrongUrl = 'https://www.google.com';
	describe('acm url tests', () => {
		it('check acm url returns true', async () => {
			const result = await isAcmUrl(acmUrl);

			expect(result).toBe(true);
		});
		it('check acm url returns false', async () => {
			const result = await isAcmUrl(wrongUrl);

			expect(result).toBe(false);
		});
	});
	describe('researchr url tests', () => {
		it('check researchr url returns true', async () => {
			const result = await isRschrUrl(rschrUrl);

			expect(result).toBe(true);
		});
		it('check researchr url returns false', async () => {
			const result = await isRschrUrl(wrongUrl);

			expect(result).toBe(false);
		});
	});
});
