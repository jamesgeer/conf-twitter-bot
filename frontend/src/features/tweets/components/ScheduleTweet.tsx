import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

interface Props {
	setDateTimeISO: React.Dispatch<React.SetStateAction<string>>;
}

const ScheduleTweet = ({ setDateTimeISO }: Props) => {
	// new date time object containing temporal information for -> now <-
	const currentDateTime = dayjs();
	// three days from now
	const defaultDateTime = currentDateTime.add(3, 'day');

	const [day, setDay] = useState(defaultDateTime.date().toString());
	const [month, setMonth] = useState(defaultDateTime.month().toString());
	const [year, setYear] = useState(defaultDateTime.year().toString());
	const [hour, setHour] = useState(defaultDateTime.hour().toString());
	const [minute, setMinute] = useState(defaultDateTime.minute().toString());

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	const dayOptions = (length: number) => {
		return Array.from({ length }).map((_, index) => {
			const oneBasedIndex = index + 1;
			return (
				<option key={oneBasedIndex} value={oneBasedIndex} className="dark:bg-slate-700">
					{oneBasedIndex}
				</option>
			);
		});
	};

	const monthOptions = months.map((month, index) => {
		return (
			<option key={month} value={index} className="dark:bg-slate-700">
				{month}
			</option>
		);
	});

	const yearOptions = (length: number) => {
		return Array.from({ length }).map((_, index) => {
			const year = currentDateTime.year() + index;
			return (
				<option key={year} value={year} className="dark:bg-slate-700">
					{year}
				</option>
			);
		});
	};

	// hours and minutes
	const timeOptions = (length: number) => {
		return Array.from({ length }).map((_, index) => {
			return (
				<option key={index} value={index} className="dark:bg-slate-700">
					{index < 10 ? `0${index}` : index}
				</option>
			);
		});
	};

	// set date time once component has fully loaded otherwise an error will occur
	useEffect(() => {
		// add one to the months as "dayjs" treats months as zero-based, but ISO 86001 treats them as one-based
		// so when "dayjs" parses a ISO string it converts it back to zero-based, removing a month
		// also months are strings so must be parsed before +/-, otherwise you'll do something like "8" + 1 = "81"
		const oneBasedMonth = (parseInt(month) + 1).toString();
		const enteredDateTime = dayjs(`${year}-${oneBasedMonth}-${day} ${hour}:${minute}`, 'YYYY-M-D H:m');
		setDateTimeISO(enteredDateTime.toISOString());
	}, [day, month, year, hour, minute, setDateTimeISO]);

	return (
		<div className="grid grid-flow-col gap-x-4">
			<div className="rounded-2xl bg-slate-100 p-3 dark:bg-transparent dark:border dark:border-white">
				<small className="dark:text-white">Date</small>
				<div className="grid grid-flow-col gap-x-4">
					<div>
						<label htmlFor="days" className="pr-1 dark:text-white">
							Day
						</label>
						<select
							name="days"
							id="days"
							className="dark:text-white dark:bg-slate-700"
							value={day}
							onChange={(e) => setDay(e.target.value)}
						>
							{dayOptions(defaultDateTime.daysInMonth())}
						</select>
					</div>
					<div>
						<label htmlFor="months" className="pr-1 dark:text-white">
							Month
						</label>
						<select
							name="months"
							id="months"
							className="dark:text-white dark:bg-slate-700"
							value={month}
							onChange={(e) => setMonth(e.target.value)}
						>
							{monthOptions}
						</select>
					</div>
					<div>
						<label htmlFor="years" className="pr-1 dark:text-white">
							Year
						</label>
						<select
							name="years"
							id="years"
							className="dark:text-white dark:bg-slate-700"
							value={year}
							onChange={(e) => setYear(e.target.value)}
						>
							{yearOptions(3)}
						</select>
					</div>
				</div>
			</div>
			<div className="p-3">
				<small className="dark:text-white">Time</small>
				<div className="grid grid-flow-col gap-x-4">
					<div>
						<label htmlFor="hours" className="pr-1 dark:text-white">
							Hour
						</label>
						<select
							name="hours"
							id="hours"
							className="dark:bg-transparent dark:text-white"
							value={hour}
							onChange={(e) => setHour(e.target.value)}
						>
							{timeOptions(24)}
						</select>
					</div>
					<div>
						<label htmlFor="minutes" className="pr-1 dark:text-white">
							Minute
						</label>
						<select
							name="minutes"
							id="minutes"
							className="dark:bg-transparent dark:text-white"
							value={minute}
							onChange={(e) => setMinute(e.target.value)}
						>
							{timeOptions(60)}
						</select>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ScheduleTweet;
