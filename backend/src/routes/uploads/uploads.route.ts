import Router from '@koa/router';
import koaBody from 'koa-body';
import { uploads, upload, createUpload, removeUpload } from './uploads-controller';
import { uploadFolder } from '../util';

const uploadsRouter = new Router({ prefix: '/uploads' });

// configuration object for how uploads are accepted/handled by koa
const uploadConfig = {
	formidable: {
		uploadDir: uploadFolder, // directory where files will be uploaded
		keepExtensions: true, // keep file extension on upload
		multiples: true,
	},
	multipart: true,
	urlencoded: true,
	formLimit: '5mb',
};

/**
 * Get all uploads for the provided tweet id
 *
 * GET: /api/uploads/tweet/:id
 */
uploadsRouter.get('/tweet/:id', koaBody(), uploads); // id = tweetId)

/**
 * Attach uploads to the provided tweet id
 *
 * POST: /api/uploads/tweet/:id
 */
uploadsRouter.post('/tweet/:id', koaBody(uploadConfig), createUpload);

/**
 * Get upload with id
 *
 * GET: /api/uploads/:id
 */
uploadsRouter.get('/:id', upload);

/**
 * Create upload
 *
 * POST: /api/uploads
 */
uploadsRouter.post('/', koaBody(uploadConfig), createUpload);

/**
 * Update upload with id
 *
 * PATCH: /api/uploads/:id
 */
uploadsRouter.patch('/:id', () => console.log('PATCH NOT IMPLEMENTED'));

/**
 * Delete upload with id
 *
 * DELETE: /api/uploads/:id
 */
uploadsRouter.delete('/:id', removeUpload);

export default uploadsRouter;
