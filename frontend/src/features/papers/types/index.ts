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
}

export type Papers = Array<AcmPaper | RschrPaper>;
