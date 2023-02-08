export interface ScrapeHistoryElm {
	links : string,
	errors : string,
	scrapeDate : Date,
}

export type ScrapeHistory = Array<ScrapeHistoryElm>;