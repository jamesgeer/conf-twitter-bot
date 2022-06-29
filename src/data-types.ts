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

export interface PaperForTemplate extends Paper {
	abstract: string;
	fullAuthors: string;
}

export interface Tweet {
	id?: number;
	text: string;

	/** This is a data url encoding of the image/PNG. */
	image: string;

	paperId: number;
	userId?: string;

	/** UTC time as per Date.toJSON(). */
	scheduledTime?: string;

	/** Whether the tweet was already sent. */
	sent?: boolean;
}

export interface Proceeding {
	id: number;
	url: string;
}

export interface Data {
	papers: Paper[];
	proceedings: Proceeding[];
	tweets: (Tweet | null)[];

	numPapers: number;
	numProceedings: number;
	numTweets: number;
}

export interface SchedulingConfig {
	nextDate: Date;
	everyNDays: number;

	/** in minutes since midnight, UTC */
	earliestTime: number;

	/** in minutes since midnight, UTC */
	latestTime: number;
}

export interface SchedulingConfigJson {
	nextDate: string;
	everyNDays: number;

	/** in minutes since midnight, UTC */
	earliestTime: number;

	/** in minutes since midnight, UTC */
	latestTime: number;
}

export interface Config {
	[key: string]: ConfigForUser;
}

export interface ConfigForUser {
	tweetTpl: string;
	pictureTpl: string;
	pictureStyle: string;
	scheduleConfig?: SchedulingConfigJson;
}
