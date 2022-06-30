import { readFileSync, writeFileSync } from 'fs';
import { cancelExistingJob, doAt } from './do-on-date.js';
import { fetchListOfPapersACM, fetchFullPaperDetails, isAcmUrl } from './scrapper-acm-dl.js';
import { robustPath } from './util.js';
import { Data, Paper, Proceeding, Tweet } from './data-types.js';
import { createTweetWithImage } from './twitter.js';
import { fetchListOfPapersResearchr } from './scrapper-researchr.js';

export function scheduleTweeting(tweet: Tweet): boolean {
	if (!tweet.scheduledTime || !tweet.id || tweet.sent || !tweet.userId) {
		return false;
	}

	cancelExistingJob(tweet.id);

	const date = new Date(tweet.scheduledTime);
	doAt(
		date,
		async () => {
			tweet.sent = true;
			persistData();
			console.log(`Send tweet: ${tweet.id}  ${new Date().toJSON()}`);
			const created = await createTweetWithImage(tweet);
			console.log(`Sending tweet ${tweet.id} ${created ? 'succeeded' : 'failed'}`);
		},
		tweet.id,
	);

	return true;
}

export async function loadFullDetails(paperId: number): Promise<Paper> {
	const paper = getPaper(paperId);
	if (!paper.fullAbstract) {
		await fetchFullPaperDetails(paper);
		persistData();
	}
	return paper;
}

// slow, requires investigation
export async function loadAll(urls: string[]): Promise<Paper[]> {
	const allPapers: Paper[] = [];
	for (const url of urls) {
		// eslint-disable-next-line no-await-in-loop
		const papers = await getListOfPapers(url);
		allPapers.push(...papers);
	}
	return allPapers;
}

async function getListOfPapers(url: string): Promise<Paper[]> {
	const proc = getOrAddProceedings(url);

	let papers = getPapersForProceeding(proc);
	if (papers.length > 0) {
		return papers;
	}

	if (isAcmUrl(url)) {
		papers = await fetchListOfPapersACM(url);
	} else {
		papers = await fetchListOfPapersResearchr(url);
	}
	addPapersToProceedings(papers, proc);
	return papers;
}

function getPapersForProceeding(proc: Proceeding) {
	const data = loadData();
	return data.papers.filter((paper) => paper.proceedingsId === proc.id);
}

function getPaper(paperId: number) {
	const data = loadData();
	return data.papers[paperId];
}

export function getQueuedTweets(userId: string): (Tweet | null)[] {
	const data = loadData();
	return data.tweets.filter((t) => t?.userId === userId);
}

export function getQueuedTweet(id: number): Tweet | null {
	const data = loadData();
	if (!data.tweets) {
		return null;
	}
	if (id < 0 || id >= data.tweets.length) {
		return null;
	}

	return data.tweets[id];
}

export function saveTweet(tweet: Tweet): void {
	const data = loadData();
	if (typeof tweet.id === 'number') {
		const oldTweet = data.tweets[tweet.id];
		data.tweets[tweet.id] = tweet;
		console.assert(oldTweet !== null, 'Tweet has id, and is expected to be !=null');
		console.assert(tweet.id === oldTweet?.id, 'Tweet id is expected to match');
		console.assert(tweet.userId === oldTweet?.userId, 'Tweet userId is expected to match');
		tweet.sent = oldTweet?.sent;

		if (oldTweet?.scheduledTime !== tweet.scheduledTime) {
			scheduleTweeting(tweet);
		}
	} else {
		if (data.tweets === undefined) {
			data.tweets = [];
			data.numTweets = 0;
		}
		console.assert(data.numTweets === data.tweets.length);
		const tweetId = data.numTweets;
		data.numTweets += 1;

		tweet.id = tweetId;
		data.tweets.push(tweet);
		scheduleTweeting(tweet);
	}
	persistData();
}

export function deleteTweetById(id: number): void {
	const data = loadData();
	data.tweets[id] = null;
	cancelExistingJob(id);
}

function addPapersToProceedings(papers: Paper[], proc: Proceeding) {
	const data = loadData();
	for (const paper of papers) {
		console.assert(data.numPapers === data.papers.length);
		const paperId = data.numPapers;
		data.numPapers += 1;

		paper.id = paperId;
		paper.proceedingsId = proc.id;

		data.papers.push(paper);
	}

	persistData();
}

function getOrAddProceedings(url: string) {
	const data = loadData();
	let proc = data.proceedings.find((val) => val.url === url);

	if (proc === undefined) {
		const procId = data.numProceedings;
		console.assert(data.numProceedings === data.proceedings.length);

		data.numProceedings += 1;
		proc = {
			url,
			id: procId,
		};
		data.proceedings.push(proc);
	}

	return proc;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function hasProceeding(url: string) {
	const data = loadData();
	const proc = data.proceedings.find((val) => val.url === url);
	return proc !== undefined;
}

let data: Data | null = null;

// void is a guess
export function loadDataAndScheduleTasks(): void {
	const data = loadData();
	const { tweets } = data;
	if (tweets) {
		for (const tweet of tweets) {
			if (tweet) {
				scheduleTweeting(tweet);
			}
		}
	}
}

function loadData(): Data {
	if (data !== null) {
		return data;
	}

	try {
		data = <Data>JSON.parse(readFileSync(robustPath('../data.json')).toString());
		data.papers = <Paper[]>fixupDataAfterLoadIfNeeded(data.papers);
		data.proceedings = <Proceeding[]>fixupDataAfterLoadIfNeeded(data.proceedings);
		data.tweets = <Tweet[]>fixupDataAfterLoadIfNeeded(data.tweets);
	} catch (e) {
		data = {
			papers: [],
			proceedings: [],
			tweets: [],
			numTweets: 0,
			numPapers: 0,
			numProceedings: 0,
		};
	}
	return data;
}

function fixupDataAfterLoadIfNeeded(items: ({ id?: number } | null)[]): ({ id?: number } | null)[] {
	const result: ({ id?: number } | null)[] = [];

	let maxId = -1;

	for (const item of items) {
		if (item && item.id !== undefined && item.id !== null) {
			maxId = Math.max(maxId, item.id);

			while (result.length < item.id) {
				result.push(<any>null);
			}
		}

		result.push(item);
	}

	// check consistency
	// eslint-disable-next-line guard-for-in
	for (const i in result) {
		const item = result[i];
		if (item && item.id !== undefined && item.id !== null) {
			console.assert(item.id === parseInt(i, 10));
		}
	}

	return result;
}

function persistData() {
	writeFileSync(robustPath('../data.json'), JSON.stringify(data));
}

export function dataUrlToFile(dataUrl: string): string {
	const buf = dataUrlToBuffer(dataUrl);
	const fileName = robustPath('../cache/image.png');
	writeFileSync(fileName, buf);
	return fileName;
}

export function dataUrlToBuffer(dataUrl: string): Buffer {
	if (dataUrl.indexOf('data:') !== 0) {
		throw new Error(`Data url does not start with \`data:\` ${dataUrl.substring(0, 20)}...`);
	}

	const data = dataUrl.split(',');
	console.assert(data.length === 2);
	const imageData = data[1];
	const meta = data[0].replace('data:', '').split(';');
	console.assert(meta[1] === 'base64');

	return Buffer.from(imageData, 'base64');
}
