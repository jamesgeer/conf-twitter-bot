import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';
import { scrapePaper } from './scraper-model';

export const scrape = async (ctx: ParameterizedContext): Promise<void> => {
	const { urls } = ctx.params;
	const scraped = scrapePaper(urls);

	if (scraped) {
		ctx.status = HttpStatus.OK;
		ctx.body = { message: 'Successful scrape request.' };
		return;
	}

	ctx.status = HttpStatus.OK;
	ctx.body = { message: 'Unsuccessful scrape request.' };
};
