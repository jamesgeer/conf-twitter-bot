/*
Homepage: https://dl.acm.org/
Example proceeding: https://dl.acm.org/doi/proceedings/10.1145/3357390

[ ] 1. Table of papers
[ ]   - parse ACM DL overview page
[ ]   - parse ACM DL paper pages
*/
import { JSDOM } from 'jsdom';
import axios from 'axios';
import * as fs from 'fs';
import UserAgent from 'user-agents';
import { Paper } from '../../types/paper-types';

export function isAcmUrl(url: string): boolean {
	return url.includes('/dl.acm.org/');
}

// async function fetchHtmlOrUsedCached(url: string): Promise<string | Buffer> {
// 	// if (!url) {
// 	// 	return '';
// 	// }
// 	//
// 	// const pathToFile = path.relative(process.cwd(), 'cache/');
// 	// const hashedName = `${pathToFile + hashToString(url)}.html`;
// 	//
// 	// if (existsSync(hashedName)) {
// 	// 	return readFileSync(hashedName);
// 	// }
//
// 	console.log(`Fetch ${url}`);
// 	const cookieJar = new CookieJar();
// 	const response = await fetch(cookieJar, url);
// 	const html = await response.text();
// 	// writeFileSync(hashedName, html);
//
// 	return html;
// }

// export function toDataTable(papers: Paper[]): string[][] {
// 	const result: string[][] = [];
// 	for (const p of papers) {
// 		result.push([
// 			'',
// 			p.title,
// 			p.type,
// 			<string>p.url,
// 			<string>(<any>p.authors),
// 			<string>p.monthYear,
// 			<string>p.pages,
// 			<string>p.shortAbstract,
// 			<string>(<unknown>p.citations),
// 			<string>(<unknown>p.downloads),
// 		]);
// 	}
// 	return result;
// }

// export async function fetchFullPaperDetails(paper: Paper): Promise<Paper> {
// 	const html = await fetchHtmlOrUsedCached(<string>paper.url);
//
// 	console.log(html);
//
// 	const dom = new JSDOM(html);
// 	const { document } = dom.window;
// 	paper.fullAbstract = document.querySelector('.abstractInFull')?.innerHTML;
// 	return paper;
// }

const fetchHTML = async (url: string): Promise<string> => {
	const { data: html } = await axios.get(url, {
		headers: {
			Accept: '*/*',
			Host: 'dl.acm.org',
			'User-Agent': new UserAgent(),
		},
		withCredentials: true,
	});

	try {
		fs.writeFileSync('output.html', html);
	} catch (err) {
		console.error(err);
	}
	return html;
};

export async function fetchListOfPapersACM(url: string): Promise<Paper[]> {
	const html = await fetchHTML(url);

	console.log(html);

	const dom = new JSDOM(html);
	const { document } = dom.window;
	const paperTypes = document.querySelectorAll('.issue-heading');
	const paperTitleHTags = document.querySelectorAll('.issue-item__title');
	const authorContainers = document.querySelectorAll('[aria-label=authors]');
	const dateAndPages = document.querySelectorAll('.issue-item__detail');
	const shortAbstracts = document.querySelectorAll('.issue-item__abstract');
	const citations = document.querySelectorAll('span.citation');
	const downloads = document.querySelectorAll('span.metric');

	console.log(paperTitleHTags);

	const numPapers = paperTypes.length;
	const papers: Paper[] = [];

	console.assert(numPapers === paperTitleHTags.length && numPapers === authorContainers.length);

	for (let i = 0; i < numPapers; i++) {
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

	console.log(papers);

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
	for (const author of authorContainers[i].querySelectorAll('li a') as any) {
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

fetchHTML('https://dl.acm.org/doi/proceedings/10.1145/3357390').then();
