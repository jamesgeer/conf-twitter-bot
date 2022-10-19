import { useColorMode } from '@chakra-ui/react';
import { IconMoon, IconSun } from '@tabler/icons';

const DarkModeButton = () => {
	const { colorMode, toggleColorMode } = useColorMode();

	const handleHtmlClass = (): any => {
		if (colorMode === 'light') {
			document.documentElement.classList.remove('dark');
			return <IconMoon />;
		} else {
			document.documentElement.classList.add('dark');
			return <IconSun />;
		}
	};

	return (
		<div>
			<button onClick={toggleColorMode}>{colorMode === 'light' ? handleHtmlClass() : handleHtmlClass()}</button>
		</div>
	);
};

export default DarkModeButton;
