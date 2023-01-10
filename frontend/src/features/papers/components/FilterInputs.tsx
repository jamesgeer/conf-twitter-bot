import { InputGroup, InputLeftElement, Input, Icon, Select, Box } from '@chakra-ui/react';
import { IconSearch } from '@tabler/icons';
import { useState } from 'react';

const FilterInputs = () => {
	const [searchInput, setSearchInput] = useState('');
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value);
	return (
		<div className="mb-4">
			<InputGroup>
				<InputLeftElement pointerEvents="none" children={<IconSearch />} />
				<Input onChange={handleChange} variant="outline" placeholder="Title or keyword" />
			</InputGroup>

			<div className="mt-4 flex flex-row gap-6">
				<Box w="20%">
					<Select placeholder="Conference"></Select>
				</Box>
				<Box w="20%">
					<Select placeholder="Year"></Select>
				</Box>
			</div>
		</div>
	);
};

export default FilterInputs;
