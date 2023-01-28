import * as cron from 'node-cron';
import tweetSchedule from './tweet/schedule';

const cronJobs = async (): Promise<void> => {
	// run every minute of everyday
	cron.schedule('* * * * *', await tweetSchedule);
};

export default cronJobs;
