import playwright from 'playwright';

export async function ScrapePaper(url: string): Promise<string> {
	const browser = await playwright.chromium.launch({
		headless: true, // setting this to true will not run the UI
	});

	const page = await browser.newPage();
	await page.goto(url);

	await browser.close();
	return url;
}
