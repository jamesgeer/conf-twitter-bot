import playwright, { ElementHandle } from 'playwright';
import { Paper, Papers } from '../papers/papers';
import { logToFile } from '../../logging/logging';
import prisma from '../../../lib/prisma';

export async function scrapePapers(urls: string): Promise<boolean> {
	try {
		const urlsArray = urls.trim().split('\n');

		// go through each URL and check what website it belongs to, then scrape accordingly
		for (const url of urlsArray) {
			// eslint-disable-next-line no-await-in-loop
			if (await isAcmUrl(url.trim())) {
				// TODO: for testing purposes just console log now
				scrapeListOfAcmPapers(url.trim()).then((r) => console.log(r));
			}
		}
		return true;
	} catch (e) {
		console.error(e);
		console.log(logToFile(e));
		return false;
	}
}

async function isAcmUrl(url: string): Promise<boolean> {
	return url.includes('/dl.acm.org/');
}

// returns true if successfully scraped, false otherwise
async function scrapeListOfAcmPapers(url: string): Promise<boolean> {
	// there's also playwright.firefox , we'll need to compare them at a later date for performance/memory
	const browser = await playwright.chromium.launch({
		headless: true, // setting this to true will not run the UI
	});
	try {
		// opens a page
		const page = await browser.newPage();

		// goes to that URL | TODO: error catching
		await page.goto(url);

		// TODO: also grab the DOI link for automatic full page scraping
		const paperTypes = await page.$$('.issue-heading');
		const paperTitleHTags = await page.$$('.issue-item__title');
		// TODO: click the "+" symbol if it exists for all authors to open
		const authorContainers = await page.$$('[aria-label=authors]');
		const dateAndPages = await page.$$('.issue-item__detail');
		const shortAbstracts = await page.$$('.issue-item__abstract');
		const citations = await page.$$('span.citation');
		const downloads = await page.$$('span.metric');

		const numPapers = paperTypes.length;
		const papers: Papers = [];
		console.assert(numPapers === paperTitleHTags.length && numPapers === authorContainers.length);

		for (let i = 0; i < numPapers; i += 1) {
			try {
				papers.push(
					// eslint-disable-next-line no-await-in-loop
					await extractAcmPaper(
						authorContainers,
						i,
						dateAndPages,
						paperTypes,
						paperTitleHTags,
						shortAbstracts,
						citations,
						downloads,
					),
				);
			} catch (e) {
				// ignore entry
			}
		}
		return await uploadPapersToDatabase(papers);
	} catch (error) {
		return false;
	} finally {
		await browser.close();
	}
}

async function uploadPapersToDatabase(papers: Papers): Promise<boolean> {
	if (papers.length === 0) {
		return false;
	}
	for (const thisPaper of papers) {
		try {
			// eslint-disable-next-line no-await-in-loop
			await prisma.paper.create({
				data: {
					type: thisPaper.type,
					title: thisPaper.title,
					authors: thisPaper.authors,
					fullAuthors: thisPaper.fullAuthors,
					doi: thisPaper.doi,
					url: thisPaper.url,
					preprint: thisPaper.preprint,
					shortAbstract: thisPaper.shortAbstract,
					fullAbstract: thisPaper.fullAbstract,
					monthYear: thisPaper.monthYear,
					pages: thisPaper.pages,
					citations: thisPaper.citations,
					downloads: thisPaper.downloads,
				},
			});
		} catch (e) {
			console.log(logToFile(e));
		}
	}
	// TODO: add some kind of check in case some papers were not actually created, maybe in the try catch above
	return true;
}

async function extractAcmPaper(
	authorContainers: ElementHandle<SVGElement | HTMLElement>[],
	i: number,
	dateAndPages: ElementHandle<SVGElement | HTMLElement>[],
	paperTypes: ElementHandle<SVGElement | HTMLElement>[],
	paperTitleHTags: ElementHandle<SVGElement | HTMLElement>[],
	shortAbstracts: ElementHandle<SVGElement | HTMLElement>[],
	citations: ElementHandle<SVGElement | HTMLElement>[],
	downloads: ElementHandle<SVGElement | HTMLElement>[],
): Promise<Paper> {
	// GRAB AUTHORS
	const authors = await authorContainers[i].$$eval('li a', (authorElm) => {
		const data: string[] = [];
		authorElm.forEach((elm) => {
			if (elm.textContent != null) data.push(elm.textContent);
		});
		return data;
	});

	const spans = await dateAndPages[i].$$('span');
	// const monthYear = await spans[0].textContent().then((data) => data?.replace(', ', ''));
	const href = await paperTitleHTags[i].$eval('a', (hrefElm) => hrefElm.href);
	let paperType = await paperTypes[i].textContent();
	if (paperType == null) paperType = '';
	let title = await paperTitleHTags[i].textContent();
	if (title == null) title = '';
	let pages = await spans[0].textContent();
	if (pages == null) pages = '';

	return {
		type: paperType,
		title,
		url: href,
		doi: href?.replace('https://dl.acm.org/doi', ''),
		authors,
		// monthYear,
		pages,
		shortAbstract: (await shortAbstracts[i].innerText()).trim(),
		citations: Number(await citations[i].textContent()),
		downloads: Number(await downloads[i].textContent()),
	};
}
