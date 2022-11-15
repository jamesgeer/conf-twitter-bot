import Router from '@koa/router';
import koaBody from 'koa-body';
import { scrape } from './scraper-controller';

const scraperRouter = new Router({ prefix: '/scraper' });

// POST /api/scraper/
scraperRouter.post('/', koaBody(), scrape);

export default scraperRouter;
