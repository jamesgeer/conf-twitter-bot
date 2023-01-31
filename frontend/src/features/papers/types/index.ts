export interface AcmPaper {
	type: string;

	title: string;
	authors: string[];
	fullAuthors?: string;

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
}

export interface PaperSearch {
	search?: string;
	year?: string;
	source?: string;
}

export interface RschrPaper {
	title: string;
	authors: string[];
	fullAuthors?: string;

	doi?: string;
	url: string;
	preprint?: string;

	shortAbstract: string;
	fullAbstract?: string;
	source: string;
}

export type Papers = Array<AcmPaper | RschrPaper>;
