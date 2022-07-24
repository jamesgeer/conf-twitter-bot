import { TwitterAccount } from '../../../types/twitter-types';
import React from 'react';

const DashboardSidebar = () => {
	const sideBarList = ['Scheduled', 'History', 'Data', 'Change Account', 'Tweet'];

	const sideBarButtons = sideBarList.map((item: string) => {
		return (
			<li>
				<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
					{item}
				</button>
			</li>
		);
	});

	return (
		<div>
			<ul className="mt-6 grid gap-y-6">{sideBarButtons}</ul>
		</div>
	);
};

export default DashboardSidebar;
