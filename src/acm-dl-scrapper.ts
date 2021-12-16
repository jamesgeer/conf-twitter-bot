/*
[ ] 1. Table of papers
[ ]   - parse ACM DL overview page
[ ]   - parse ACM DL paper pages
*/

// https://dl.acm.org/doi/proceedings/10.1145/3357390

import { createHash } from 'crypto';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { fetch, CookieJar } from 'node-fetch-cookies';
import { robustPath } from './util.js';

export function hashToString(str: string): string {
  return createHash('sha256').update(str).digest('hex');
}

export async function loadAll(urls: string[]): Promise<Paper[]> {
  const allPapers: Paper[] = [];
  for (const url of urls) {
    const papers = await getListOfPapers(url);
    allPapers.push(...papers);
  }
  return allPapers;
}

export async function fetchHtmlOrUsedCached(
  url: string
): Promise<string | Buffer> {
  const hashedName = robustPath('../cache/') + hashToString(url) + '.html';

  if (existsSync(hashedName)) {
    return readFileSync(hashedName);
  }

  console.log('Fetch ' + url);
  const cookieJar = new CookieJar();
  const response = await fetch(cookieJar, url);
  const html = await response.text();
  writeFileSync(hashedName, html);

  return html;
}

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
}

export function toDataTable(papers: Paper[]): string[][] {
  const result: string[][] = [];
  for (const p of papers) {
    result.push([
      '',
      p.title,
      p.type,
      p.url,
      <string>(<any>p.authors),
      p.monthYear,
      p.pages,
      p.shortAbstract,
      <string>(<unknown>p.citations),
      <string>(<unknown>p.downloads)
    ]);
  }
  return result;
}

export async function getListOfPapers(url: string): Promise<Paper[]> {
  const html = await fetchHtmlOrUsedCached(url);

  const dom = new JSDOM(html);
  const document = dom.window.document;
  const paperTypes = document.querySelectorAll('.issue-heading');
  const paperTitleHTags = document.querySelectorAll('.issue-item__title');
  const authorContainers = document.querySelectorAll('[aria-label=authors]');
  const dateAndPages = document.querySelectorAll('.issue-item__detail');
  const shortAbstracts = document.querySelectorAll('.issue-item__abstract');
  const citations = document.querySelectorAll('span.citation');
  const downloads = document.querySelectorAll('span.metric');

  const numPapers = paperTypes.length;
  const papers: any[] = [];

  console.assert(
    numPapers == paperTitleHTags.length && numPapers == authorContainers.length
  );

  for (let i = 0; i < numPapers; i += 1) {
    try {
      papers.push(
        extractPaper(
          authorContainers,
          i,
          dateAndPages,
          paperTypes,
          paperTitleHTags,
          shortAbstracts,
          citations,
          downloads
        )
      );
    } catch (e) {
      // ignore entry
    }
  }

  return papers;
}

function extractPaper(
  authorContainers: NodeListOf<Element>,
  i: number,
  dateAndPages: NodeListOf<Element>,
  paperTypes: NodeListOf<Element>,
  paperTitleHTags: NodeListOf<Element>,
  shortAbstracts: NodeListOf<Element>,
  citations: NodeListOf<Element>,
  downloads: NodeListOf<Element>
) {
  const authors: string[] = [];
  for (const author of authorContainers[i].querySelectorAll('li a')) {
    const authorName = <string>author.textContent;
    if (authorName[0] !== ' ') {
      authors.push(authorName);
    }
  }

  const spans = dateAndPages[i].querySelectorAll('span');
  const monthYear = spans[0].textContent?.replace(', ', '');
  const pages = spans[1].textContent;

  return {
    type: paperTypes[i].textContent,
    title: paperTitleHTags[i].textContent,
    url:
      'https://dl.acm.org' +
      paperTitleHTags[i].children[0].getAttribute('href'),
    authors: authors,
    monthYear,
    pages,
    shortAbstract: shortAbstracts[i].innerHTML.trim(),
    citations: Number(citations[i].textContent),
    downloads: Number(downloads[i].textContent)
  };
}
