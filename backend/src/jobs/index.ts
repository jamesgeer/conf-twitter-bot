import * as cron from 'node-cron';
import tweetSchedule from './tweet/schedule';
import cleanupSchedule from './cleanup/cleanup';

/**
 * CRON Format:
 * MIN 0 to 59
 * HOUR 0 to 23
 * DOM (day of month) 1-31
 * MON (month) 1-12
 * DOW (day of week) 0-6
 * the * means every so * * * * * is every minute of every hour of every day of every month of every week
 */
const cronJobs = async (): Promise<void> => {
	// run every minute of everyday
	cron.schedule('* * * * *', await tweetSchedule);

	// every day at 04:00
	cron.schedule('0 4 * * *', await cleanupSchedule);
};

export default cronJobs;
