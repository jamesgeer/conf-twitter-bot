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

export type Papers = Array<Paper>;

export interface PaperSearch {
	search?: string;
	year?: string;
	conference?: string;
}
