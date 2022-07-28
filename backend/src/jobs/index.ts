import * as cron from 'node-cron';
import tweetsSchedule from './twitter/tweets-schedule';

const cronJobs = (): void => {
	console.log('Cron jobs initialised');

	cron.schedule('* * * * *', tweetsSchedule);
};

export default cronJobs;
