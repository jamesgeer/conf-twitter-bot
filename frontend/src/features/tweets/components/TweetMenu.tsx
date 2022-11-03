import { IconDotsVertical, IconAlertTriangle, IconPencil } from '@tabler/icons';
import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';

interface Props {
	isActive: boolean;
	handleButtonClick: (e: any, a: number) => void;
	tweetId: number;
}

const TweetMenu = ({ isActive, handleButtonClick, tweetId }: Props) => {
	return (
		<Menu>
			<MenuButton
				onClick={(e) => handleButtonClick(e, tweetId)}
				as={Button}
				rightIcon={<IconDotsVertical />}
				bg="none"
				_hover={{ bg: 'none' }}
				_active={{ bg: 'none' }}
			></MenuButton>
			{isActive && (
				<MenuList onClick={(e) => e.stopPropagation()}>
					<MenuItem bg="white" icon={<IconPencil />}>
						Edit
					</MenuItem>
					<MenuItem color="red.500" bg="white" _hover={{ bg: 'red.100' }} icon={<IconAlertTriangle />}>
						Delete
					</MenuItem>
				</MenuList>
			)}
		</Menu>
	);
};

export default TweetMenu;
