/*
[ ] 1. Table of papers
[ ]   - parse ACM DL overview page
[ ]   - parse ACM DL paper pages
*/

// https://dl.acm.org/doi/proceedings/10.1145/3357390

import { JSDOM } from 'jsdom';
import { Paper } from './data-types.js';
import { fetchHtmlOrUsedCached } from './web-scrapper.js';

export function isAcmUrl(url: string): boolean {
	return url.includes('/dl.acm.org/');
}

export function toDataTable(papers: Paper[]): string[][] {
	const result: string[][] = [];
	for (const p of papers) {
		result.push([
			'',
			p.title,
			p.type,
			<string>p.url,
			<string>(<any>p.authors),
			<string>p.monthYear,
			<string>p.pages,
			<string>p.shortAbstract,
			<string>(<unknown>p.citations),
			<string>(<unknown>p.downloads),
		]);
	}
	return result;
}

export async function fetchFullPaperDetails(paper: Paper): Promise<Paper> {
	const html = await fetchHtmlOrUsedCached(<string>paper.url);

	const dom = new JSDOM(html);
	const { document } = dom.window;
	const abstract = document.querySelector('.abstractInFull')?.innerHTML;
	paper.fullAbstract = abstract;
	return paper;
}

export async function fetchListOfPapersACM(url: string): Promise<Paper[]> {
	const html = await fetchHtmlOrUsedCached(url);

	const dom = new JSDOM(html);
	const { document } = dom.window;
	const paperTypes = document.querySelectorAll('.issue-heading');
	const paperTitleHTags = document.querySelectorAll('.issue-item__title');
	const authorContainers = document.querySelectorAll('[aria-label=authors]');
	const dateAndPages = document.querySelectorAll('.issue-item__detail');
	const shortAbstracts = document.querySelectorAll('.issue-item__abstract');
	const citations = document.querySelectorAll('span.citation');
	const downloads = document.querySelectorAll('span.metric');

	const numPapers = paperTypes.length;
	const papers: Paper[] = [];

	console.assert(numPapers === paperTitleHTags.length && numPapers === authorContainers.length);

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
					downloads,
				),
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
	downloads: NodeListOf<Element>,
): Paper {
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
	const href = paperTitleHTags[i].children[0].getAttribute('href');

	return {
		type: <string>paperTypes[i].textContent,
		title: <string>paperTitleHTags[i].textContent,
		url: `https://dl.acm.org${href}`,
		doi: <string>href?.replace('/doi/', ''),
		authors,
		monthYear: <string>monthYear,
		pages: <string>pages,
		shortAbstract: shortAbstracts[i].innerHTML.trim(),
		citations: Number(citations[i].textContent),
		downloads: Number(downloads[i].textContent),
	};
}
