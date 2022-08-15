import * as cron from 'node-cron';
import tweetsSchedule from './twitter/tweets-schedule';

const cronJobs = (): void => {
	// run every minute of everyday
	cron.schedule('* * * * *', tweetsSchedule);
};

export default cronJobs;
