/**
 * Every [set_interval] retrieve tweets from the database that have not been sent and have
 * a scheduled time before now, and [now + one minute], loop over results and post these to Twitter
 */
const tweetsSchedule = (): void => {
	console.log('Running a task every minute');
};

export default tweetsSchedule;
