import Router from '@koa/router';
import koaBody from 'koa-body';
import { scrape, history } from './scraper-controller';

const scraperRouter = new Router({ prefix: '/scraper' });

// POST /api/scraper/
scraperRouter.post('/', koaBody(), scrape);

// GET /api/scraper/history
scraperRouter.get('/history', koaBody(), history);

export default scraperRouter;
