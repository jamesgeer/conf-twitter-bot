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

export interface Proceeding {
  id: number;
  url: string;
}

export interface Data {
  papers: Paper[];
  proceedings: Proceeding[];

  numPapers: number;
  numProceedings: number;
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
      numPapers: 0,
      numProceedings: 0
    };
  }
  return data;
}

function persistData() {
  writeFileSync(robustPath('../data.json'), JSON.stringify(data));
}
