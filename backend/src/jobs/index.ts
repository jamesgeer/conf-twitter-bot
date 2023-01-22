import * as cron from 'node-cron';
import tweetSchedule from './tweet/schedule';

const cronJobs = (): void => {
	// run every minute of everyday
	cron.schedule('* * * * *', tweetSchedule);
};

export default cronJobs;
