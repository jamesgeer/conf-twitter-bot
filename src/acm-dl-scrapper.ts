/*
[ ] 1. Table of papers
[ ]   - parse ACM DL overview page
[ ]   - parse ACM DL paper pages
*/

// https://dl.acm.org/doi/proceedings/10.1145/3357390

import { createHash } from 'crypto';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import got from 'got';
import { robustPath } from './util';

export function hashToString(str: string): string {
  return createHash('sha256').update(str).digest('hex');
}

export async function fetchHtmlOrUsedCached(
  url: string
): Promise<string | Buffer> {
  const hashedName = robustPath('../cache/') + hashToString(url) + '.html';

  if (existsSync(hashedName)) {
    return readFileSync(hashedName);
  }

  // const headers = new Headers({
  //   'User-Agent': 'curl/7.55.1'
  // });

  const html = await got(url).text();
  writeFileSync(hashedName, html);

  return html;
}

export async function getListOfPapers(url: string): Promise<any[]> {
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
    const authors: string[] = [];
    for (const author of document
      .querySelectorAll('[aria-label=authors]')[0]
      .querySelectorAll('li a')) {
      const authorName = <string>author.textContent;
      if (authorName[0] !== ' ') {
        authors.push(authorName);
      }
    }

    const spans = dateAndPages[i].querySelectorAll('span');
    const monthYear = spans[0].textContent?.replace(', ', '');
    const pages = spans[1].textContent;

    papers.push({
      type: paperTypes[i].textContent,
      title: paperTitleHTags[i].textContent,
      url:
        'https://dl.acm.org' +
        paperTitleHTags[i].children[0].getAttribute('href'),
      authors: authors,
      monthYear,
      pages,
      shortAbstract: shortAbstracts[0].innerHTML,
      citations: Number(citations[0].textContent),
      downloads: Number(downloads[0].textContent)
    });
  }

  return papers;
}
