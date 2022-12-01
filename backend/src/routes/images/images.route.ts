import Router from '@koa/router';
import koaBody from 'koa-body';
import { attachImage, removeImage, tweetImage } from './images-controller';

const imagesRouter = new Router({ prefix: '/images' });

// GET: /api/images/:id
imagesRouter.get('/:id', tweetImage);

// POST: /api/images
imagesRouter.post(
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
	attachImage,
);

// PATCH: /api/images/:id
imagesRouter.patch('/:id', () => console.log('PATCH NOT IMPLEMENTED'));

// DELETE: /api/images/:id
imagesRouter.delete('/:id', removeImage);

export default imagesRouter;
