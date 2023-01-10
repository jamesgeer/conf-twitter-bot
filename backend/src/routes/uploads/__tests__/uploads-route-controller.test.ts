import supertest from 'supertest';
import HttpStatus from 'http-status';
import http from 'http';
import looksSame from 'looks-same';
import { app } from '../../../app';
import { TestHarness } from '../../../tests/TestHarness';
import { Upload, Uploads } from '../uploads';
import { uploadFileExists } from '../uploads-model';

const request = supertest(http.createServer(app.callback()));

const harness = new TestHarness();

const uploadsEndpoint = '/api/uploads';

// before any tests are run
beforeAll(async () => {
	await harness.createStandard();
});

// after all tests complete
afterAll(async () => {
	await TestHarness.deleteAll();
});

const testImage = (imageName: string) => `${__dirname}/${imageName}.png`;

const testImage1 = testImage('test_image_1');
const testImage2 = testImage('test_image_2');

describe('single upload crud operation', () => {
	let imageId: number;

	it('POST upload without file should return bad request error', async () => {
		// create a tweet and extract its id for attaching an image
		const tweet = await harness.createTweet();

		// post request with tweet id but without a file attached
		const response = await request.post(uploadsEndpoint).attach('tweetId', tweet.id);

		expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
	});

	it('POST upload should create image and return image', async () => {
		// create a tweet and extract its id for attaching an image
		const tweet = await harness.createTweet();

		// post request with tweet id and image attached
		const response = await request.post(uploadsEndpoint).attach('tweetId', tweet.id).attach('media', testImage1);

		expect(response.status).toEqual(HttpStatus.OK);

		const uploads: Uploads = response.body;

		// first upload from array
		const [upload] = uploads;
		expect(upload.tweetId).toEqual(tweet.id);
		expect(upload.name).toContain('upload_');

		// check uploaded file exists in system
		expect(await uploadFileExists(upload.name)).toBe(true);

		imageId = upload.id;
	});

	it('GET image should return image', async () => {
		const response = await request.get(`${uploadsEndpoint}/${imageId}`);

		expect(response.status).toEqual(HttpStatus.OK);

		const upload: Upload = response.body;
		expect(upload.id).toEqual(imageId);
		expect(upload.name).toContain('upload_');
	});

	it('GET uploaded image should equal test image', async () => {
		const response = await request.get(`${uploadsEndpoint}/${imageId}`);
		const upload: Upload = response.body;

		// upload.url won't work for this test as the connection will be refused
		const uploadResponse = await request.get(`/uploads/${upload.name}`);
		expect(uploadResponse.status).toEqual(HttpStatus.OK);

		// compare uploaded image to test image, they should be the same
		const { equal } = await looksSame(uploadResponse.body, testImage1);
		expect(equal).toBe(true);
	});

	it('GET uploaded image should not equal different image', async () => {
		const response = await request.get(`${uploadsEndpoint}/${imageId}`);
		const upload: Upload = response.body;
		const uploadResponse = await request.get(`/uploads/${upload.name}`);
		const { equal } = await looksSame(uploadResponse.body, testImage2);

		expect(equal).toBe(false);
	});

	it('DELETE image should delete image', async () => {
		const response = await request.delete(`${uploadsEndpoint}/${imageId}`);

		expect(response.status).toEqual(HttpStatus.OK);

		const upload: Upload = response.body;
		expect(await uploadFileExists(upload.name)).toBe(false);
	});
});

describe('multiple uploads crud operation', () => {
	const responseImages: Upload[] = [];
	let testTweetId: number;

	it('POST multiple uploads should return uploads', async () => {
		// create a tweet and extract its id for attaching an image
		const { id: tweetId } = await harness.createTweet();

		// post request with tweet id and image attached
		const response = await request
			.post(uploadsEndpoint)
			.attach('tweetId', tweetId)
			.attach('media', testImage1)
			.attach('media', testImage2);

		expect(response.status).toEqual(HttpStatus.OK);
		expect(response.body.length).toEqual(2);

		const uploads: Upload[] = response.body;
		uploads.forEach((upload: Upload) => {
			expect(upload.tweetId).toEqual(tweetId);
			responseImages.push(upload);
		});

		testTweetId = tweetId;
	});

	it('GET should return all uploads for tweet id', async () => {
		const response = await request.get(`${uploadsEndpoint}/tweet/${testTweetId}`);

		expect(response.status).toEqual(HttpStatus.OK);
		expect(response.body.length).toEqual(2);
	});

	it('DELETE image should delete multiple uploads', async () => {
		await Promise.all(
			responseImages.map(async (respImage) => {
				const response = await request.delete(`${uploadsEndpoint}/${respImage.id}`);

				expect(response.status).toEqual(HttpStatus.OK);

				const upload: Upload = response.body;
				expect(await uploadFileExists(upload.name)).toBe(false);
			}),
		);
	});
});
