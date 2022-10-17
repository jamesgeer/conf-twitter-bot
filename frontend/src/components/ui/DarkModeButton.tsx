import { useColorMode } from '@chakra-ui/react';
import { IconMoon, IconSun } from '@tabler/icons';

const DarkModeButton = () => {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<div>
			<button onClick={toggleColorMode}>{colorMode === 'light' ? <IconMoon /> : <IconSun />}</button>
		</div>
	);
};

export default DarkModeButton;
