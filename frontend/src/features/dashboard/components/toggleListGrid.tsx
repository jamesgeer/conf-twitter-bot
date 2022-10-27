import { Button, Stack } from '@chakra-ui/react';
import { IconList, IconLayoutGrid } from '@tabler/icons';
import React, { useEffect, useState } from 'react';

interface Props {
	handleClick: (e: React.MouseEvent<HTMLButtonElement>, name: string) => void;
}

const ToggleListGrid = ({ handleClick }: Props) => {
	return (
		<>
			<Stack spacing={4} direction="row" align="center">
				<Button variant="outline" size="sm" onClick={(e) => handleClick(e, 'list')}>
					{<IconList />}
				</Button>
				<Button variant="outline" size="sm" onClick={(e) => handleClick(e, 'grid')}>
					{<IconLayoutGrid />}
				</Button>
			</Stack>
		</>
	);
};

export default ToggleListGrid;
