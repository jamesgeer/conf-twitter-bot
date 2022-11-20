interface Props {
	handleClick: (index: number, item: string) => void;
}

const Sidebar = ({ handleClick }: Props) => {
	// 'Schedule', 'History', 'Papers', 'Change Account', 'Tweets'
	const sideBarList = ['Tweets', 'Papers', 'Scraper'];

	const sideBarButtons = sideBarList.map((item, index) => {
		return (
			<li key={index}>
				<button
					className="bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 text-left text-xl font-bold py-2 px-4 rounded-full"
					onClick={() => handleClick(index, item)}
				>
					{item}
				</button>
			</li>
		);
	});

	return (
		<div className="col-span-2">
			<ul className="grid gap-y-6">{sideBarButtons}</ul>
		</div>
	);
};

export default Sidebar;
