export interface Image {
	id: number;
	tweetId: number;
	name: string;
	path: string;
	alt: string | null;
}

export type Images = Array<Image>;
