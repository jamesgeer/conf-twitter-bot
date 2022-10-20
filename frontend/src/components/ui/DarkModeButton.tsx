import { Button, useColorMode } from '@chakra-ui/react';
import { IconMoon, IconSun } from '@tabler/icons';
import React, { useEffect, useState } from 'react';

const DarkModeButton = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const [icon, setIcon] = useState(<IconSun />);

	useEffect(() => {
		if (colorMode === 'light') {
			document.documentElement.classList.remove('dark');
			setIcon(<IconMoon />);
		} else {
			document.documentElement.classList.add('dark');
			setIcon(<IconSun />);
		}
		console.log('useEffect: ' + colorMode);
	}, [colorMode]);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		toggleColorMode();
	};

	return (
		<div>
			<Button variant="ghost" onClick={(e) => handleClick(e)}>
				{icon}
			</Button>
		</div>
	);
};

export default DarkModeButton;
