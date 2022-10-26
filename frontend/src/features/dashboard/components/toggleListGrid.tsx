import { Button, Stack } from '@chakra-ui/react';
import { IconList, IconLayoutGrid } from '@tabler/icons';
import React, { useEffect, useState } from 'react';

const ToggleListGrid = () => {
	const [isList, setListActive] = useState(true);
	const [isGrid, setGridActive] = useState(false);

	useEffect(() => {
		if (isList === true) {
			//set List button as active color
			console.log('active: list');
		} else {
			//set Grid button as active color
			console.log('active: grid');
		}
	}, [isList, isGrid]);

	const handleListClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!isList) {
			setListActive(true);
			setGridActive(false);
		}
	};

	const handleGridClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!isGrid) {
			setGridActive(true);
			setListActive(false);
		}
	};

	return (
		<>
			<Stack spacing={4} direction="row" align="center">
				<Button variant="outline" size="sm" onClick={(e) => handleListClick(e)}>
					{<IconList />}
				</Button>
				<Button variant="outline" size="sm" onClick={(e) => handleGridClick(e)}>
					{<IconLayoutGrid />}
				</Button>
			</Stack>
		</>
	);
};

export default ToggleListGrid;
