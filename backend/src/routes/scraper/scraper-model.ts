import playwright, { ElementHandle } from 'playwright';
import { AcmPaper, RschrPaper, Papers } from '../papers/papers';
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
				// logs out true if the scraping was succesful, false otherwise
				await scrapeListOfAcmPapers(url.trim()).then((r) => console.log(r));
			} else if (await isRschrUrl(url.trim())) {
				await scrapeListOfRschrPapers(url.trim()).then((r) => console.log(r));
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

async function isRschrUrl(url: string): Promise<boolean> {
	// every single conference on researchr seems to have its own domain or a different one to the others
	// the only thing they have in common, is that the papers tab always end with #event-overview
	// other than that, there'll only be a preliminary check while scraping to make sure that the page
	// is actually correct
	return url.endsWith('#event-overview');
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

		const paperTypes = await page.$$('.issue-heading');
		const paperTitleHTags = await page.$$('.issue-item__title');

		const authorPlusButtons = await page.$$('.removed-items-count').then((v) => v.length);
		for (let i = 0; i < authorPlusButtons; i++) {
			try {
				await page.click('.removed-items-count', { timeout: 1000 });
			} catch (error) {
				if (error instanceof playwright.errors.TimeoutError) {
					console.log('Expand authors button could not be clicked...');
					console.log(logToFile(error));
				}
			}
		}
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
async function extractAcmPaper(
	authorContainers: ElementHandle<SVGElement | HTMLElement>[],
	i: number,
	dateAndPages: ElementHandle<SVGElement | HTMLElement>[],
	paperTypes: ElementHandle<SVGElement | HTMLElement>[],
	paperTitleHTags: ElementHandle<SVGElement | HTMLElement>[],
	shortAbstracts: ElementHandle<SVGElement | HTMLElement>[],
	citations: ElementHandle<SVGElement | HTMLElement>[],
	downloads: ElementHandle<SVGElement | HTMLElement>[],
): Promise<AcmPaper> {
	// GRAB AUTHORS
	const authors = await authorContainers[i].$$eval('li a', (authorElm) => {
		const data: string[] = [];
		authorElm.forEach((elm) => {
			if (elm.textContent != null && elm.textContent.trim() !== '(Less)') data.push(elm.textContent);
		});
		return data;
	});

	const spans = await dateAndPages[i].$$('span');
	// TODO: scrape monthYear correctly
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
// returns true if successfully scraped, false otherwise

async function scrapeListOfRschrPapers(url: string): Promise<boolean> {
	// there's also playwright.firefox , we'll need to compare them at a later date for performance/memory
	const browser = await playwright.chromium.launch({
		headless: true, // setting this to true will not run the UI
	});
	try {
		// opens a page
		const page = await browser.newPage();

		// goes to that URL | TODO: error catching
		await page.goto(url);
		// get how many papers there are on the page
		const paperRows = await page.$$('#event-overview tbody tr').then((v) => v.length);
		const links: string[] = [];
		// then open them and copy the link to their page
		for (let i = 0; i < paperRows; i++) {
			try {
				// open the modal
				await page.click(`div#event-overview tbody tr:nth-child(${i + 1}) td:nth-child(2) a`, {
					timeout: 1000,
					force: true,
				});
				// copy url from All Details
				const urlContainer = page.locator(
					`#event-modals .appended:nth-child(${i + 1}) .modal-footer .pull-left a`,
				);
				await urlContainer.waitFor({ timeout: 500 });
				let link = await urlContainer.getAttribute('href');
				if (link == null) link = ''; // TODO: behaviour for when a link to paper not found
				links.push(link);

				// close the modal and continue
				await page.click(`#event-modals .appended:nth-child(${i + 1}) .modal-header a`, {
					timeout: 1000,
					force: true,
				});
			} catch (error) {
				if (error instanceof playwright.errors.TimeoutError) {
					console.log('Some error');
					console.log(logToFile(error));
				}
			}
		}
		const papers: Papers = [];
		for (let i = 0; i < paperRows; i += 1) {
			try {
				papers.push(
					// eslint-disable-next-line no-await-in-loop
					await extractRschrPaper(
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
		return true;
		// return await uploadPapersToDatabase(papers);
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
			if ('type' in thisPaper) {
				await prisma.acmPaper.upsert({
					where: {
						doi: thisPaper.doi,
					},
					update: {
						type: thisPaper.type,
						title: thisPaper.title,
						authors: thisPaper.authors,
						fullAuthors: thisPaper.fullAuthors,
						url: thisPaper.url,
						preprint: thisPaper.preprint,
						shortAbstract: thisPaper.shortAbstract,
						fullAbstract: thisPaper.fullAbstract,
						monthYear: thisPaper.monthYear,
						pages: thisPaper.pages,
						citations: thisPaper.citations,
						downloads: thisPaper.downloads,
					},
					create: {
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
			} else {
				// eslint-disable-next-line no-await-in-loop
				await prisma.researchrPaper.create({
					data: {
						title: thisPaper.title,
						authors: thisPaper.authors,
						fullAuthors: thisPaper.fullAuthors,
						doi: thisPaper.doi,
						url: thisPaper.url,
						preprint: thisPaper.preprint,
						shortAbstract: thisPaper.shortAbstract,
						fullAbstract: thisPaper.fullAbstract,
					},
				});
			}
		} catch (e) {
			console.log(logToFile(e));
		}
	}
	// TODO: add some kind of check in case some papers were not actually created, maybe in the try catch above
	return true;
}

/*
async function extractRschrPaper(
	authorContainers: ElementHandle<SVGElement | HTMLElement>[],
	i: number,
	dateAndPages: ElementHandle<SVGElement | HTMLElement>[],
	paperTypes: ElementHandle<SVGElement | HTMLElement>[],
	paperTitleHTags: ElementHandle<SVGElement | HTMLElement>[],
	shortAbstracts: ElementHandle<SVGElement | HTMLElement>[],
): Promise<RschrPaper> {
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
	let title = await paperTitleHTags[i].textContent();
	if (title == null) title = '';
	let pages = await spans[0].textContent();
	if (pages == null) pages = '';

	return {
		title,
		url: href,
		doi: href?.replace('https://dl.acm.org/doi', ''),
		authors,
		// monthYear,
		shortAbstract: (await shortAbstracts[i].innerText()).trim(),
	};
} */
