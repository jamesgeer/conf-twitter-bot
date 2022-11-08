import { IconDotsVertical, IconAlertTriangle, IconPencil } from '@tabler/icons';
import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { useDeleteTweet } from '../api/deleteTweet';

interface Props {
	handleClick: (menuItem: string) => void;
}

const TweetMenu = ({ handleClick }: Props) => {
	return (
		<Menu isLazy>
			<MenuButton
				as={Button}
				rightIcon={<IconDotsVertical />}
				bg="none"
				_hover={{ bg: 'none' }}
				_active={{ bg: 'none' }}
			></MenuButton>
			<MenuList onClick={(e) => e.stopPropagation()}>
				<MenuItem bg="white" icon={<IconPencil />}>
					Edit
				</MenuItem>
				<MenuItem
					color="red.500"
					bg="white"
					_hover={{ bg: 'red.100' }}
					icon={<IconAlertTriangle />}
					onClick={() => handleClick('delete')}
				>
					Delete
				</MenuItem>
			</MenuList>
		</Menu>
	);
};

export default TweetMenu;
