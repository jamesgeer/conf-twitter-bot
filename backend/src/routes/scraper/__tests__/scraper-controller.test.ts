import supertest from 'supertest';
import http from 'http';
import HttpStatus from 'http-status';
import { app } from '../../../app';
import { ScrapeHistory } from "../scraper";
import prisma from '../../../../lib/prisma';

const request = supertest(http.createServer(app.callback()));

const scrapeHistoryEndpoint = '/api/scraper/history';
const scraperEndpoint = '/api/scraper/';

beforeAll(async () => {
    await prisma.paper.deleteMany({});
    await prisma.scrapeHistory.deleteMany({});
});

afterAll(async () => {
    await prisma.paper.deleteMany({});
    await prisma.scrapeHistory.deleteMany({});
});

it('GET scrape history should return an empty array', async () => {
    const response = await request.get(scrapeHistoryEndpoint);

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body).toEqual([]);
});

it('GET scrape history should return an array with one element', async () => {
    
    const response = await request.get(scrapeHistoryEndpoint);

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body).toEqual([]);
});