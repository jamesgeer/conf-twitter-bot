const DateTimeSelection = () => {
	return (
		<div className="grid grid-flow-col gap-x-4">
			<div className="rounded-2xl bg-slate-100 p-3">
				<small>Date</small>
				<div className="grid grid-flow-col gap-x-4">
					<div>
						<label htmlFor="days" className="pr-1">
							Day
						</label>
						<select name="days" id="days">
							<option value="1">1</option>
						</select>
					</div>
					<div>
						<label htmlFor="months" className="pr-1">
							Month
						</label>
						<select name="months" id="months">
							<option value="1">January</option>
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
							<option value="00">00</option>
						</select>
					</div>
					<div>
						<label htmlFor="minutes" className="pr-1">
							Minute
						</label>
						<select name="minutes" id="minutes">
							<option value="00">00</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DateTimeSelection;
