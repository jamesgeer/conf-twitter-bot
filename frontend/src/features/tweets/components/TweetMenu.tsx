import { IconDotsVertical, IconAlertTriangle, IconPencil } from '@tabler/icons-react';
import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';

interface Props {
	sent: boolean;
	handleClick: (menuItem: string) => void;
}

const TweetMenu = ({ sent, handleClick }: Props) => {
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
				{!sent && (
					<MenuItem bg="white" icon={<IconPencil />} onClick={() => handleClick('edit')}>
						Edit
					</MenuItem>
				)}

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
