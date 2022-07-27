/**
 * Model for creating/reading/updating/deleting stored tweets
 * TODO: Convert from JSON store to DB Object
 */
import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { Tweet, Tweets } from '../types/twitter-types';

let tweets: Tweets;
const pathToFile = path.relative(process.cwd(), 'data/tweets.json');

export const getTweets = (): Tweets => {
	try {
		const fileContent = readFileSync(pathToFile).toString();
		tweets = <Tweets>JSON.parse(fileContent);
	} catch (e) {
		console.error(e);
		tweets = [];
	}
	return tweets;
};

export const insertTweet = (tweet: Tweet): boolean => {
	tweets.push(tweet);
	try {
		writeFileSync(pathToFile, JSON.stringify(tweets));
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};
