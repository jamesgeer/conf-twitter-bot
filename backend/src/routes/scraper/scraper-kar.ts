import axios from 'axios';
import { Paper, Papers } from '../papers/papers';
import { uploadPapersToDatabase } from './upload-papers-to-database';

async function extractPublications(publications: any) {
	if (publications.length === 0) {
		return [];
	}
	const papers: Papers = [];
	for (let i = 0; i < publications.length; i += 1) {
		// extract doi if possible
		let doiUrl = publications[i].url;
		if (doiUrl != null) {
			if (!doiUrl.includes('doi')) {
				doiUrl = null;
			}
		}
		// extract author first and last name and reconstruct array
		const authors: string[] = [];
		for (const author of publications[i].authors) {
			const fullName = `${author.given} ${author.family}`;
			authors.push(fullName);
		}
		let year: string | null = null;
		if (publications[i].year != null) {
			year = publications[i].year.toString();
		}
		let pages: string | null = null;
		if (publications[i].pages != null) {
			pages = publications[i].pages.toString();
		}
		if (publications[i].abstract == null) {
			publications[i].abstract = 'No abstract available.';
		}
		const paper: Paper = {
			authors,
			doi: doiUrl,
			fullAbstract: publications[i].abstract,
			fullAuthors: publications[i].authors_list,
			monthYear: year,
			pages,
			shortAbstract: publications[i].abstract,
			source: 'kar',
			title: publications[i].title,
			type: publications[i].type,
			url: publications[i].kar_url,
		};
		papers.push(paper);
	}
	return papers;
}

export async function scrapeKarPapers(email: string, errors: string): Promise<{ success: boolean; errors: string }> {
	try {
		// https://api.kent.ac.uk/api/v1/kar/s.marr@kent.ac.uk
		// build kar api link, url is the email of the user
		const karLink = `https://api.kent.ac.uk/api/v1/kar/${email}`;
		const response = await axios.get(karLink);
		const publications = await response.data.publications;
		const papers: Papers = await extractPublications(publications);

		const result = await uploadPapersToDatabase(papers, errors);
		const { success } = result;
		errors = result.errors;
		return { success, errors };
	} catch (error) {
		console.log(error);
		errors += 'Could not scrape website on kar.\n';
		return { success: false, errors };
	}
}
