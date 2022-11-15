import playwright from 'playwright';
import { Papers } from '../papers/papers';
import { logToFile } from '../../logging/logging';

export const scrapePapers = (urls: string): boolean => {
	try {
		const urlsArray = urls.trim().split('\n');

		// go through each URL and check what website it belongs to, then scrape accordingly
		for (const url of urlsArray) {
			if (isAcmUrl(url.trim())) {
				// TODO: for testing purposes just console log now
				scrapeAcmPaper(url.trim()).then((r) => console.log(r));
			}
		}
		return true;
	} catch (e) {
		console.error(e);
		console.log(logToFile(e));
		return false;
	}
};

export function isAcmUrl(url: string): boolean {
	return url.includes('/dl.acm.org/');
}

// returns true if successfully scraped, false otherwise
export async function scrapeAcmPaper(url: string): Promise<boolean> {
	// there's also playwright.firefox , we'll need to compare them at a later date for perfomance/memory
	const browser = await playwright.chromium.launch({
		headless: true, // setting this to true will not run the UI
	});

	const page = await browser.newPage();
	await page.goto(url);

	await browser.close();
	return true;
}
