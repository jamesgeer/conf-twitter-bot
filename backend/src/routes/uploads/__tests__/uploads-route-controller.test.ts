import supertest from 'supertest';
import HttpStatus from 'http-status';
import http from 'http';
import path from 'path';
import looksSame from 'looks-same';
import * as fs from 'fs';
import { app } from '../../../app';
import prisma from '../../../../lib/prisma';
import { TestHarness } from '../../../tests/TestHarness';
import { Upload } from '../uploads';

const request = supertest(http.createServer(app.callback()));

const harness = new TestHarness();

const uploadsEndpoint = '/api/uploads';

// before any tests are run
beforeAll(async () => {
	await harness.createStandard();
});

// after all tests complete
afterAll(async () => {
	await prisma.upload.deleteMany({});
	await prisma.tweet.deleteMany({});
	await prisma.account.deleteMany({});
	await prisma.twitterUser.deleteMany({});
	await prisma.user.deleteMany({});
	await prisma.$disconnect();
});

const testImage = (imageName: string) => `${__dirname}/${imageName}.png`;

const testImage1 = testImage('test_image_1');
const testImage2 = testImage('test_image_2');

describe('single upload crud operation', () => {
	let imageId: number;

	it('POST upload should create new image and return image', async () => {
		// create a tweet and extract its id for attaching an image
		const { id: tweetId } = await harness.createTweet();

		// post request with tweet id and image attached
		const response = await request.post(uploadsEndpoint).attach('tweetId', tweetId).attach('media', testImage1);

		expect(response.status).toEqual(HttpStatus.OK);

		// first image from array
		const [image] = response.body;
		expect(image.tweetId).toEqual(tweetId);
		expect(image.name).toEqual(path.parse(testImage1).base); // (name)test_image_1.png === (base)test_image_1.png

		imageId = image.id;
	});

	it('GET image should return image', async () => {
		const response = await request.get(`${uploadsEndpoint}/${imageId}`);
		expect(response.status).toEqual(HttpStatus.OK);
		console.log(response.body);

		// compare uploaded image to test image, they should be the same
		const { equal } = await looksSame(response.body, testImage1);
		expect(equal).toBe(true);
	});

	it('DELETE image should delete image', async () => {
		const response = await request.delete(`${uploadsEndpoint}/${imageId}`);

		expect(response.status).toEqual(HttpStatus.OK);

		const upload: Upload = response.body;
		const imageFileExists = fs.existsSync(upload.path);
		expect(imageFileExists).toBe(false);
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
		console.log(response.body);
		expect(response.body.length).toEqual(2);
	});

	it('DELETE image should delete multiple uploads', async () => {
		await Promise.all(
			responseImages.map(async (respImage) => {
				const response = await request.delete(`${uploadsEndpoint}/${respImage.id}`);

				expect(response.status).toEqual(HttpStatus.OK);

				const upload: Upload = response.body;
				const uploadFileExists = fs.existsSync(upload.path);
				expect(uploadFileExists).toBe(false);
			}),
		);
	});
});
