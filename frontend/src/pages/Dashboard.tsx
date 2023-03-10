import Sidebar from '../features/dashboard/components/Sidebar';
import Content from '../features/dashboard/components/Content';
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
			<Content active={active} setActive={setActive} />
		</div>
	);
};

export default Index;
