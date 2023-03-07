export interface ScrapeHistoryElm {
	links: string;
	errors: string;
	scrapeDate: Date | string;
}

export type ScrapeHistory = Array<ScrapeHistoryElm>;
