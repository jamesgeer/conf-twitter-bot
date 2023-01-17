export interface Upload {
	id: number;
	tweetId: number;
	name: string;
	url: string;
	alt: string | null;
	type: string;
}

export type Uploads = Array<Upload>;
