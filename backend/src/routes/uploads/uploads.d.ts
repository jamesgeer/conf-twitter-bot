export interface Upload {
	id: number;
	tweetId: number;
	name: string;
	path: string;
	alt: string | null;
	type: string;
}

export type Uploads = Array<Uploads>;
