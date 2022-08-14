import React from 'react';

const Sidebar = () => {
	const sideBarList = ['Schedule', 'History', 'Data', 'Change Account', 'Tweet'];

	const sideBarButtons = sideBarList.map((item, index) => {
		return (
			<li key={index}>
				<button className="bg-transparent hover:bg-slate-100 text-left text-xl font-bold py-2 px-4 rounded-full">
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
