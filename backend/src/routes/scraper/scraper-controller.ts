import HttpStatus from 'http-status';
import { ParameterizedContext } from 'koa';
import { scrapePapers } from './scraper-model';

export const scrape = async (ctx: ParameterizedContext): Promise<void> => {
	const { urls } = ctx.request.body;
	const scraped = await scrapePapers(urls);

	if (scraped) {
		ctx.status = HttpStatus.OK;
		ctx.body = { message: 'Successful scrape request.' };
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = { message: 'Unsuccessful scrape request.' };
};
