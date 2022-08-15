import Sidebar from './Sidebar';
import Content from './Content';
import { useState } from 'react';

const initialState = {
	index: 0,
	title: '',
};

const Index = () => {
	const [active, setActive] = useState(initialState);

	const handleClick = (index: number, title: string): void => {
		setActive({
			index,
			title,
		});
	};

	return (
		<div className="container grid grid-cols-10 m-auto">
			<Sidebar handleClick={handleClick} />
			<Content active={active} />
		</div>
	);
};

export default Index;
