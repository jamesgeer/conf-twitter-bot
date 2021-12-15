import Koa from 'koa';
// import koaBody from 'koa-body';
import Router from 'koa-router';
import { getListOfPapers } from './acm-dl-scrapper';
import { processTemplate } from './templates';

const port = process.env.PORT || 33333;

// const DEBUG = 'DEBUG' in process.env ? process.env.DEBUG === 'true' : false;
// const DEV = 'DEV' in process.env ? process.env.DEV === 'true' : false;

const app = new Koa();
const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = processTemplate('index.html', {
    data: JSON.stringify(
      await getListOfPapers(
        'https://dl.acm.org/doi/proceedings/10.1145/3357390'
      )
    )
  });
  ctx.type = 'html';
});

app.use(router.routes());
app.use(router.allowedMethods());

(async () => {
  console.log(`Starting server on http://localhost:${port}`);
  app.listen(port);
})();
