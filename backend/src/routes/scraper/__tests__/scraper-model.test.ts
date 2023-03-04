import path from 'path';
import prisma from '../../../../lib/prisma';
import {
	getHistory,
	isAcmUrl,
	isRschrUrl,
	scrapeListOfAcmPapers,
	uploadScrapeHistoryToDatabase,
} from '../scraper-model';
import { ScrapeHistoryElm } from '../scraper';
import { Paper, Papers } from '../../papers/papers';
import { uploadPapersToDatabase } from '../upload-papers-to-database';
import { scrapeKarPapers } from '../scraper-kar';

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

describe('test upload papers to database', () => {
	const acmPaper: Paper = { authors: [], shortAbstract: '', source: 'acm', title: 'The acm paper', url: '' };
	const rschrPaper: Paper = { authors: [], shortAbstract: '', source: 'rschr', title: '', url: '' };
	const karPaper: Paper = { authors: [], shortAbstract: '', source: 'kar', title: '', url: '' };
	const badPaper: Paper = { authors: [], shortAbstract: '', source: 'badSource', title: '', url: '' };
	it('should not upload an empty array', async () => {
		const result = await uploadPapersToDatabase([], '');

		expect(result.success).toBe(false);
	});
	it('should upload an acm paper', async () => {
		const result = await uploadPapersToDatabase([acmPaper], '');
		let testRes: Paper | null = await prisma.paper.findFirst({
			where: {
				source: 'acm',
			},
		});
		await prisma.paper.deleteMany({});
		expect(result.success).toBe(true);
		if (testRes == null) {
			testRes = { authors: [], shortAbstract: '', source: '', title: 'this was null', url: '' };
		}
		expect(testRes.title).toBe(acmPaper.title);
	});
	it('should upload a researchr paper', async () => {
		const result = await uploadPapersToDatabase([rschrPaper], '');
		let testRes: Paper | null = await prisma.paper.findFirst({
			where: {
				source: 'rschr',
			},
		});
		await prisma.paper.deleteMany({});
		expect(result.success).toBe(true);
		if (testRes == null) {
			testRes = { authors: [], shortAbstract: '', source: '', title: 'this was null', url: '' };
		}
		expect(testRes.title).toBe(rschrPaper.title);
	});
	it('should upload a kar paper', async () => {
		const result = await uploadPapersToDatabase([karPaper], '');
		let testRes: Paper | null = await prisma.paper.findFirst({
			where: {
				source: 'kar',
			},
		});
		await prisma.paper.deleteMany({});
		expect(result.success).toBe(true);
		if (testRes == null) {
			testRes = { authors: [], shortAbstract: '', source: '', title: 'this was null', url: '' };
		}
		expect(testRes.title).toBe(rschrPaper.title);
	});
	it('should not upload a paper from the wrong source', async () => {
		const result = await uploadPapersToDatabase([badPaper], '');
		const testRes = await prisma.paper.findFirst({
			where: {
				source: 'badSource',
			},
		});
		expect(result.success).toBe(true);
		expect(testRes).toBeNull();
	});
});

describe('paper scraping tests using local html', () => {
	const acmPath = `${path.join(__dirname, 'test_html/acm.htm')}`;
	const karEmail = 's.marr@kent.ac.uk';
	it('should scrape the acm html correctly', async () => {
		const result = await scrapeListOfAcmPapers(acmPath, true);
		const papers: Papers = await prisma.paper.findMany({
			where: {
				source: 'acm',
			},
		});
		await prisma.paper.deleteMany({});
		expect(result).toBe(true);
		expect(papers.length).toBe(12);
	}, 100000);
	it('should scrape kar correctly', async () => {
		const result = await scrapeKarPapers(karEmail, '');
		const papers: Papers = await prisma.paper.findMany({
			where: {
				source: 'kar',
			},
		});
		await prisma.paper.deleteMany({});
		expect(result.success).toBe(true);
		expect(result.errors).toBe('');
		expect(papers.length).toBeGreaterThanOrEqual(1);
	});
});
