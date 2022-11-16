import playwright, { ElementHandle } from 'playwright';
import { Paper, Papers } from '../papers/papers';
import { logToFile } from '../../logging/logging';

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
	} catch (error) {
		return false;
	} finally {
		await browser.close();
	}
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

	console.log(authors);
	/*
	const spans = dateAndPages[i].querySelectorAll('span');
	const monthYear = spans[0].textContent?.replace(', ', '');
	const pages = spans[1].textContent;
	const href = paperTitleHTags[i].children[0].getAttribute('href');

	return {
		type: <string>paperTypes[i].textContent,
		title: <string>paperTitleHTags[i].textContent,
		url: `https://dl.acm.org${href}`,
		doi: <string>href?.replace('/doi/', ''),
		authors,
		monthYear: <string>monthYear,
		pages: <string>pages,
		shortAbstract: shortAbstracts[i].innerHTML.trim(),
		citations: Number(citations[i].textContent),
		downloads: Number(downloads[i].textContent),
	}; */
	return {
		type: 'test',
		title: 'test',
		url: 'test',
		doi: 'test',
		authors,
		monthYear: 'test',
		pages: 'test',
		shortAbstract: 'test',
		citations: 20,
		downloads: 20,
	};
}
