export interface AcmPaper {
	type: string;

	title: string;
	authors: string[];
	fullAuthors: string;

	doi: string;
	url: string;
	preprint?: string;

	shortAbstract: string;
	fullAbstract?: string;

	monthYear?: string;
	pages?: string;

	citations?: number;
	downloads?: number;

	source: string;
	scrapeDate?: Date;
}

export interface RschrPaper {
	title: string;
	authors: string[];
	fullAuthors?: string;
	source: string;

	doi?: string | null;
	url: string;
	preprint?: string;

	shortAbstract: string;
	fullAbstract?: string;
	scrapeDate?: Date;
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

export type Papers = Array<AcmPaper | RschrPaper>;
