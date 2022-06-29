import { scheduleTweeting } from 'data';

let schedule: (Job | undefined)[] = [];
let removed = 0;
const maxRemovals = 10;

class Job {
	public completed: boolean;

	public readonly date: Date;

	public readonly id: number;

	private readonly action: () => void;

	private readonly timeout: NodeJS.Timeout | null;

	constructor(date: Date, action: () => void, timeout: NodeJS.Timeout | null, id: number) {
		this.date = date;
		this.action = action;
		this.timeout = timeout;
		this.completed = false;
		this.id = id;
	}

	public execute() {
		this.action();
	}

	public isNeverGoingToExecute() {
		return this.timeout === null;
	}

	public cancel() {
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
		removeFromScheduleList(this);
	}
}

function removeFromScheduleList(job: Job): boolean {
	removed += 1;
	if (removed > maxRemovals) {
		removed = 0;
		schedule = schedule.filter((e) => e !== undefined);
	}

	const idx = schedule.indexOf(job);
	if (idx >= 0) {
		delete schedule[idx];
		return true;
	}
	return false;
}

export function cancelExistingJob(id: number): boolean {
	for (const job of schedule) {
		if (job && job.id === id) {
			job.cancel();
			return true;
		}
	}

	return false;
}

export function doAt(date: Date, action: () => Promise<void>, id: number): Job {
	const now = Date.now();
	const inNMilliseconds = date.getTime() - now;

	let job: Job;
	let timeout: NodeJS.Timeout | null;

	if (inNMilliseconds > 0) {
		timeout = setTimeout(async () => {
			console.log(
				`[DOD] Starting execution of scheduled action for tweet ${id}. Was scheduled for ${date.toJSON()}. It's now ${new Date().toISOString()}.`
			);
			await action();
			job.completed = true;
			removeFromScheduleList(job);
		}, inNMilliseconds);
		console.log(`[DOD] Scheduled tweet ${id} for ${date.toJSON()} (in ${inNMilliseconds}ms).`);
	} else {
		timeout = null;
		console.log(`[DOD] Schedule tweet ${id} failed, scheduled time is in the past.`);
	}

	job = new Job(date, action, timeout, id);

	schedule.push(job);
	return job;
}
