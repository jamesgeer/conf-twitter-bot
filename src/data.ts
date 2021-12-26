import { readFileSync, writeFileSync } from 'fs';
import { fetchListOfPapers, fetchFullPaperDetails } from './acm-dl-scrapper.js';
import { robustPath } from './util.js';

export interface Paper {
  type: string;
  title: string;
  url: string;
  authors: string[];
  monthYear: string;
  pages: string;
  shortAbstract: string;
  citations: number;
  downloads: number;
  doi: string;

  fullAbstract?: string;

  id?: number;
  proceedingsId?: number;
}

export interface Tweet {
  id?: number;
  text: string;

  /* this is a data url encoding */
  image: string;

  paperId: number;
}
export interface Proceeding {
  id: number;
  url: string;
}

export interface Data {
  papers: Paper[];
  proceedings: Proceeding[];
  tweets: Tweet[];

  numPapers: number;
  numProceedings: number;
  numTweets;
}

export async function loadFullDetails(paperId: number): Promise<Paper> {
  const paper = getPaper(paperId);
  if (!paper.fullAbstract) {
    await fetchFullPaperDetails(paper);
    persistData();
  }
  return paper;
}

export async function loadAll(urls: string[]): Promise<Paper[]> {
  const allPapers: Paper[] = [];
  for (const url of urls) {
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

  papers = await fetchListOfPapers(url);
  addPapersToProceedings(papers, proc);
  return papers;
}

function getPapersForProceeding(proc: Proceeding) {
  const data = loadData();
  return data.papers.filter(paper => paper.proceedingsId === proc.id);
}

function getPaper(paperId: number) {
  const data = loadData();
  return data.papers[paperId];
}

export function getQueuedTweets(): Tweet[] {
  const data = loadData();
  return data.tweets;
}

export function getQueuedTweet(id: number): Tweet | null {
  const data = loadData();
  if (!data.tweets) { return null; }
  if (id < 0 || id >= data.tweets.length) { return null; }

  return data.tweets[id];
}

export function saveTweet(tweet: Tweet) {
  const data = loadData();
  if (tweet.id) {
    data.tweets[tweet.id] = tweet;
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
  }
  persistData();
  dataUrlToFile(tweet.image);
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
  let proc = data.proceedings.find(val => val.url === url);

  if (proc === undefined) {
    const procId = data.numProceedings;
    console.assert(data.numProceedings === data.proceedings.length);

    data.numProceedings += 1;
    proc = {
      url,
      id: procId
    };
    data.proceedings.push(proc);
  }

  return proc;
}

function hasProceeding(url: string) {
  const data = loadData();
  let proc = data.proceedings.find(val => val.url === url);
  return proc !== undefined;
}


let data: Data | null = null;

function loadData(): Data {
  if (data !== null) {
    return data;
  }

  try {
    data = <Data>JSON.parse(
      readFileSync(robustPath('../data.json')).toString());
  } catch (e) {
    data = {
      papers: [],
      proceedings: [],
      tweets: [],
      numTweets: 0,
      numPapers: 0,
      numProceedings: 0
    };
  }
  return data;
}

function persistData() {
  writeFileSync(robustPath('../data.json'), JSON.stringify(data));
}

export function dataUrlToFile(dataUrl: string) {
  const buf = dataUrlToBuffer(dataUrl);
  const fileName = robustPath('../cache/image.png');
  writeFileSync(fileName, buf);
  return fileName;
}

export function dataUrlToBuffer(dataUrl: string) {
  if (dataUrl.indexOf('data:') !== 0) {
    throw new Error("Data url does not start with `data:` " + dataUrl.substring(0, 20) + "...");
  }

  const data = dataUrl.split(',');
  console.assert(data.length === 2);
  const imageData = data[1];
  const meta = data[0].replace('data:', '').split(';');
  console.assert(meta[1] === 'base64');

  return Buffer.from(imageData, 'base64');
}
