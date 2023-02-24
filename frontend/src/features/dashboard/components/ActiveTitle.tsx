import React from 'react';

interface Props {
	title: string;
}

const ActiveTitle = ({ title }: Props) => {
	return (
		<div className="flex items-center justify-between gap-6">
			<h2 className="text-xl font-bold mb-4">{title}</h2>
		</div>
	);
};

export default ActiveTitle;
