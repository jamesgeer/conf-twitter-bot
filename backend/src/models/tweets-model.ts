/**
 * Model for creating/reading/updating/deleting stored tweets
 * TODO: Convert from JSON store to DB Object
 */
import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { HTTPTweet, Tweets } from '../types/twitter-types';

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

export const insertTweet = (httpTweet: HTTPTweet): boolean => {
	const { text, userId, scheduledTimeUTC } = httpTweet;

	// temp, need a better check
	if (userId.length === 0 || text.length === 0 || scheduledTimeUTC.length === 0) {
		return false;
	}

	// temp, convert httpTweet to regular tweet
	const tweet = {
		text,
		image64: '',
		paperId: 0,
		userId,
		scheduledTimeUTC,
	};

	// temp until a real database is implemented, load data
	tweets = getTweets();
	tweets.push(tweet);

	try {
		writeFileSync(pathToFile, JSON.stringify(tweets));
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};
