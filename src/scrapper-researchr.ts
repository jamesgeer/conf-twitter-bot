import { JSDOM } from 'jsdom';
import { Paper } from './data-types.js';
import { fetchHtmlOrUsedCached } from './web-scrapper.js';

const orgTypes = ['Day opening', 'Meeting', 'Day closing', 'Coffee break',
  'Lunch', 'Dinner'];

export async function fetchListOfPapersResearchr(url: string): Promise<Paper[]> {
  const html = await fetchHtmlOrUsedCached(url);

  const dom = new JSDOM(html);
  const document = dom.window.document;

  const paperTypes = document.querySelectorAll(".session-table tbody .event-type");
  const paperTitles = document.querySelectorAll(".session-table tbody td:nth-child(4) a[href='#']");

  console.assert(paperTitles.length === paperTypes.length);

  const papers: Paper[] = [];

  for (let i = 0; i < paperTitles.length; i += 1) {
    const type = <string>paperTypes[i].textContent;
    if (orgTypes.includes(type)) {
      continue;
    }

    const titleElem = paperTitles[i];
    const commonContainer = <HTMLElement>titleElem.parentElement?.parentElement;
    const authors: string[] = [];
    const authorEs = <NodeListOf<Element>>commonContainer.querySelectorAll('.performers a');
    for (const a of authorEs) {
      if (a.textContent) {
        authors.push(a.textContent);
      }
    }

    let doi: string | undefined = undefined;
    let preprint: string | undefined = undefined;
    let detailLink: string | undefined = undefined;

    for (const link of commonContainer.querySelectorAll('a.publication-link')) {
      const url = link.getAttribute('href');
      if (url?.includes('doi')) {
        doi = url.replace('https://', '').replace('http://', 'doi.org/');
      } else if (url?.includes('/details/')) {
        detailLink = url;
      } else {
        preprint = <string>url;
      }
    }

    let monthYear;
    const matches = document.querySelector('.place')?.textContent?.match(/(\w+\s\d{4})/);
    if (matches && matches[0]) {
      monthYear = matches[0];
    } else {
      monthYear = undefined;
    }

    papers.push({
      type,
      title: <string>paperTitles[i].textContent,
      url: detailLink,
      preprint,
      doi,
      authors,
      monthYear
    });
  }

  return papers;
}
