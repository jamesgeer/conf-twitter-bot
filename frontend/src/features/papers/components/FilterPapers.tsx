import { InputGroup, InputLeftElement, Input, Select, Box, Button, Flex } from '@chakra-ui/react';
import { IconSearch } from '@tabler/icons';
import React, { useRef } from 'react';

interface Props {
	setSearchInput: React.Dispatch<React.SetStateAction<{ search: string; source: string }>>;
	debouncedHandleFilter: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const FilterPapers = ({ setSearchInput, debouncedHandleFilter }: Props) => {
	const refSearch = useRef<HTMLInputElement>(null);
	const refSource = useRef<HTMLSelectElement>(null);

	const handleReset = () => {
		setSearchInput({
			search: '',
			source: '',
		});

		if (refSearch.current && refSource.current) {
			refSearch.current.value = '';
			refSource.current.value = '';
		}
	};

	return (
		<div className="mb-8 mt-3">
			<InputGroup>
				<InputLeftElement pointerEvents="none" children={<IconSearch />} />
				<Input
					name="search"
					ref={refSearch}
					onChange={(e) => debouncedHandleFilter(e)}
					variant="outline"
					placeholder="Title or keyword"
				/>
			</InputGroup>

			<div className="mt-4 flex flex-row justify-between">
				<Box>
					<Select
						name="source"
						ref={refSource}
						onChange={(e) => debouncedHandleFilter(e)}
						placeholder="Source"
					>
						<option value="acm">ACM</option>
						<option value="rschr">Researchr</option>
					</Select>
				</Box>
				<Button onClick={handleReset}>Clear all</Button>
			</div>
		</div>
	);
};

export default FilterPapers;
