import Router from '@koa/router';
import { scrape } from './scraper-controller';

const scraperRouter = new Router({ prefix: '/scraper' });

// POST /api/scraper/
scraperRouter.post('/', scrape);

export default scraperRouter;
