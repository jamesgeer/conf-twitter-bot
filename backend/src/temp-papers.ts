import koaBody from 'koa-body';
import { loadAll } from 'conf-twitter-bot/src/data';
import { fetchListOfPapersACM, isAcmUrl } from 'conf-twitter-bot/src/scrapper-acm-dl';
import { Proceeding } from 'conf-twitter-bot/src/data-types';

export interface Paper {
	type: string;

	title: string;
	authors: string[];
	fullAuthors?: string;

	doi?: string;
	url?: string;
	preprint?: string;

	shortAbstract?: string;
	fullAbstract?: string;

	monthYear?: string;
	pages?: string;

	citations?: number;
	downloads?: number;

	id?: number;
	proceedingsId?: number;
}

export interface PaperForTemplate extends Paper {
	abstract: string;
	fullAuthors: string;
}

let paperTable: any = null;
const selectedPaper: Paper | null = null;

const loadData = () => ({
	proceedings: [],
	papers: [],
	numProceedings: 0,
});

function getPapersForProceeding(proc: Proceeding) {
	const data = loadData();
	return data.papers.filter((paper) => paper.proceedingsId === proc.id);
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

function getListOfPapers(url: string): Promise<Paper[]> {
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

async function loadAll(urls: string[]): Promise<Paper[]> {
	const allPapers: Paper[] = [];
	for (const url of urls) {
		// eslint-disable-next-line no-await-in-loop
		const papers = await getListOfPapers(url);
		allPapers.push(...papers);
	}
	return allPapers;
}

router.post('/load-urls', koaBody(), async (ctx) => {
	if (!isAuthorizedJsonResponse(ctx)) {
		return;
	}

	const data = await ctx.request.body;
	const urls = data.urls.trim().split('\n');

	// eslint-disable-next-line guard-for-in
	for (const i in urls) {
		urls[i] = urls[i].trim();
	}

	const papers = await loadAll(urls);

	ctx.type = 'json';
	ctx.body = { papers };
});

async function loadUrls(urls: string): Promise<Paper[]> {
	const response = await fetch('/load-urls', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ urls }),
	});

	const data = await response.json();
	return <Paper[]>data.papers;
}

async function loadPapers() {
	const urls = <string>$('#urls').val();
	const papers = await loadUrls(urls.trim());

	paperTable?.destroy();
	paperTable = createTable(papers);

	// Add event listener for opening and closing details
	$('#papers tbody').on('click', 'td.dt-control', togglePaperDetails);
	$('#papers tbody').on('click', 'tr', togglePaperSelected);
}
