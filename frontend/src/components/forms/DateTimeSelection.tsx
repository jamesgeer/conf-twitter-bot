import dayjs from 'dayjs';
import { useState } from 'react';

const DateTimeSelection = () => {
	// new date time object containing temporal information for -> now <-
	const currentDateTime = dayjs();
	// three days from now
	const defaultDateTime = currentDateTime.add(3, 'day');

	const [day, setDay] = useState(defaultDateTime.date());
	const [month, setMonth] = useState();
	const [year, setYear] = useState();
	const [hour, setHour] = useState();
	const [minute, setMinute] = useState();

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
				<option key={oneBasedIndex} value={oneBasedIndex}>
					{oneBasedIndex}
				</option>
			);
		});
	};

	const monthOptions = months.map((month, index) => {
		return (
			<option key={month} value={index}>
				{month}
			</option>
		);
	});

	// hours and minutes
	const timeOptions = (length: number) => {
		return Array.from({ length }).map((_, index) => {
			return (
				<option key={index} value={index}>
					{index < 10 ? `0${index}` : index + 1}
				</option>
			);
		});
	};

	return (
		<div className="grid grid-flow-col gap-x-4">
			<div className="rounded-2xl bg-slate-100 p-3">
				<small>Date</small>
				<div className="grid grid-flow-col gap-x-4">
					<div>
						<label htmlFor="days" className="pr-1">
							Day
						</label>
						<select name="days" id="days" value={day} onChange={(e) => setDay(parseInt(e.target.value))}>
							{dayOptions(defaultDateTime.daysInMonth())}
						</select>
					</div>
					<div>
						<label htmlFor="months" className="pr-1">
							Month
						</label>
						<select name="months" id="months">
							{monthOptions}
						</select>
					</div>
					<div>
						<label htmlFor="years" className="pr-1">
							Year
						</label>
						<select name="years" id="years">
							<option value="2022">2022</option>
						</select>
					</div>
				</div>
			</div>
			<div className="p-3">
				<small>Time</small>
				<div className="grid grid-flow-col gap-x-4">
					<div>
						<label htmlFor="hours" className="pr-1">
							Hour
						</label>
						<select name="hours" id="hours">
							{timeOptions(24)}
						</select>
					</div>
					<div>
						<label htmlFor="minutes" className="pr-1">
							Minute
						</label>
						<select name="minutes" id="minutes">
							{timeOptions(60)}
						</select>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DateTimeSelection;
