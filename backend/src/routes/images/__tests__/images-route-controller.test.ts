import supertest from 'supertest';
import HttpStatus from 'http-status';
import http from 'http';
import path from 'path';
import looksSame from 'looks-same';
import * as fs from 'fs';
import { app } from '../../../app';
import prisma from '../../../../lib/prisma';
import { RoutesTestHarness } from '../../../tests/RoutesTestHarness';
import { Image } from '../images';

const request = supertest(http.createServer(app.callback()));

const harness = new RoutesTestHarness();

const imagesEndpoint = '/api/images';
const testImage = `${__dirname}/test_image.png`;

// before any tests are run
beforeAll(async () => {
	await harness.createStandard();
});

// after all tests complete
afterAll(async () => {
	await prisma.image.deleteMany({});
	await prisma.tweet.deleteMany({});
	await prisma.account.deleteMany({});
	await prisma.twitterUser.deleteMany({});
	await prisma.user.deleteMany({});
	await prisma.$disconnect();
});

let imageId: number;

it('POST image should create new image and return image', async () => {
	// create a tweet and extract its id for attaching an image
	const { id: tweetId } = await harness.createTweet();

	// post request with tweet id and image attached
	const response = await request.post(`${imagesEndpoint}`).attach('tweetId', tweetId).attach('images', testImage);

	expect(response.status).toEqual(HttpStatus.OK);

	// first image from array
	const [image] = response.body;
	expect(image.tweetId).toEqual(tweetId);
	expect(image.name).toEqual(path.parse(testImage).base); // (name)test_image.png === (base)test_image.png

	imageId = image.id;
});

it('GET image should return image', async () => {
	const response = await request.get(`${imagesEndpoint}/${imageId}`);
	expect(response.status).toEqual(HttpStatus.OK);

	// compare uploaded image to test image, they should be the same
	const { equal } = await looksSame(response.body, testImage);
	expect(equal).toBe(true);
});

it('DELETE image should delete image', async () => {
	const response = await request.delete(`${imagesEndpoint}/${imageId}`);

	expect(response.status).toEqual(HttpStatus.OK);

	const image: Image = response.body;
	const imageFileExists = fs.existsSync(image.path);
	expect(imageFileExists).toBe(false);
});
