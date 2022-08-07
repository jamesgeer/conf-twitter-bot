import { fetchListOfPapersACM } from '../scraper/sites/acm-dl';

test('scrape test', async () => {
	const data = await fetchListOfPapersACM('https://dl.acm.org/doi/proceedings/10.1145/3357390');
	expect(data).toBe([]);
});
