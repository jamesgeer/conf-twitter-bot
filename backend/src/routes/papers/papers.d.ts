export interface Paper {
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
}

export interface PaperForTemplate extends Paper {
	abstract: string;
	fullAuthors: string;
}

export type Papers = Array<Paper>;

export interface PaperSearchOld {
	search?: string;
	year?: string;
	type?: string;
}

export interface PaperSearch {
	payload: {
		search?: string;
		year?: string;
		type?: string;
	};
}

export interface PaperSearchDB {
	title?: string;
	monthYear?: string;
	type?: string;
}
