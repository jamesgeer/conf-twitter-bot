
export interface Paper {
  type: string;
  title: string;
  url?: string;
  preprint?: string;
  authors: string[];
  monthYear?: string;
  pages?: string;
  shortAbstract?: string;
  citations?: number;
  downloads?: number;
  doi?: string;

  fullAbstract?: string;

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
  tweetTpl: string;
  pictureTpl: string;
  pictureStyle: string;
  scheduleConfig?: SchedulingConfigJson;
}
