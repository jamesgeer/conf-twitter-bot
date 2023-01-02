import Router from '@koa/router';
import koaBody from 'koa-body';
import appRoot from 'app-root-path';
import path from 'path';
import { upload, createUpload, removeUpload } from './uploads-controller';

const uploadsRouter = new Router({ prefix: '/uploads' });
const uploadFolder = path.join(appRoot.path, 'public', 'uploads');

// GET: /api/uploads/:id
uploadsRouter.get('/:id', upload);

// POST: /api/uploads
uploadsRouter.post(
	'/',
	koaBody({
		formidable: {
			uploadDir: uploadFolder, // directory where files will be uploaded
			keepExtensions: true, // keep file extension on upload
			multiples: true,
		},
		multipart: true,
		urlencoded: true,
		formLimit: '5mb',
	}),
	createUpload,
);

// PATCH: /api/uploads/:id
uploadsRouter.patch('/:id', () => console.log('PATCH NOT IMPLEMENTED'));

// DELETE: /api/uploads/:id
uploadsRouter.delete('/:id', removeUpload);

export default uploadsRouter;
