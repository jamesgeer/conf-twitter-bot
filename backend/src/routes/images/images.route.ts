import Router from '@koa/router';
import koaBody from 'koa-body';
import tweetsRouter from '../tweets/tweets.route';

const imagesRouter = new Router({ prefix: '/images' });

// GET: /api/images/:id
imagesRouter.get(':/id', () => console.log('GET NOT IMPLEMENTED'));

// POST: /api/tweets
tweetsRouter.post(
	'/',
	koaBody({
		formidable: {
			uploadDir: 'uploads', // directory where files will be uploaded
			keepExtensions: true, // keep file extension on upload
			multiples: true,
		},
		multipart: true,
		urlencoded: true,
		formLimit: '5mb',
	}),
	() => console.log('POST NOT IMPLEMENTED'),
);

// PATCH: /api/images/:id
imagesRouter.patch(':/id', () => console.log('PATCH NOT IMPLEMENTED'));

// DELETE: /api/images/:id
imagesRouter.delete(':/id', () => console.log('DELETE NOT IMPLEMENTED'));

export default imagesRouter;
