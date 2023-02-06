import supertest from 'supertest';
import HttpStatus from 'http-status';
import http from 'http';
import { cleanUp } from '../cleanup';
import { TestHarness } from '../../../tests/TestHarness';
import { app } from '../../../app';
import { deleteUploadDb } from '../../../routes/uploads/uploads-model';
import { Upload } from '../../../routes/uploads/uploads';

const request = supertest(http.createServer(app.callback()));
const uploadsEndpoint = '/api/uploads';

const harness = new TestHarness();

// before any tests are run
beforeAll(async () => {
	await harness.createStandard();
});

const testImage = (imageName: string) => `${__dirname}/${imageName}.png`;

it('file exists in uploads folder but not in database so should be deleted', async () => {
	const tweet = await harness.createTweet();
	const uploadResponse = await request
		.post(uploadsEndpoint)
		.attach('tweetId', tweet.id)
		.attach('media', testImage('cleanup_image_1'));
	expect(uploadResponse.status).toEqual(HttpStatus.OK);

	const upload: Upload = uploadResponse.body.pop();
	const deleteResult = <Upload>await deleteUploadDb(upload.id);
	expect(deleteResult.id).toEqual(upload.id);

	const result = await cleanUp();
	expect(result.length).toEqual(1);
	expect(result.pop()).toEqual(upload.name);
});
