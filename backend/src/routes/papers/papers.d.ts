export interface Paper {
	id?: number;
	doi?: string | null;
	type?: string | null;
	title: string;
	authors: string[];
	fullAuthors?: string | null;
	url: string;
	preprint?: string | null;
	shortAbstract: string;
	fullAbstract?: string | null;
	monthYear?: string | null;
	pages?: string | null;
	citations?: number | null;
	downloads?: number | null;
	source: string;
	scrapeDate?: Date | string;
}

export interface PaperSearch {
	search?: string;
	source?: string;
}

export interface PaperSearchDB {
	title?: string;
	source?: string;
}

// export interface PaperForTemplate extends Paper {
//	abstract: string;
//	fullAuthors: string;
// }

export type Papers = Array<Paper>;
