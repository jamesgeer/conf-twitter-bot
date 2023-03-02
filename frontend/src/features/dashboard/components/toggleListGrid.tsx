import { Button, Stack } from '@chakra-ui/react';
import { IconList, IconLayoutGrid } from '@tabler/icons-react';

interface Props {
	handleClick: (e: React.MouseEvent<HTMLButtonElement>, name: string) => void;
	isList: { activeLayout: string };
}

const ToggleListGrid = ({ handleClick, isList }: Props) => {
	return (
		<>
			<Stack spacing={4} direction="row" align="center">
				<Button
					variant="outline"
					className={isList.activeLayout === 'list' ? 'opacity-40' : ''}
					size="sm"
					onClick={(e) => handleClick(e, 'list')}
				>
					{<IconList />}
				</Button>
				<Button
					variant="outline"
					className={isList.activeLayout === 'grid' ? 'opacity-40' : ''}
					size="sm"
					onClick={(e) => handleClick(e, 'grid')}
				>
					{<IconLayoutGrid />}
				</Button>
			</Stack>
		</>
	);
};

export default ToggleListGrid;
