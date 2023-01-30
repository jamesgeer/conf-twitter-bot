import { InputGroup, InputLeftElement, Input, Select, Box, Button, Flex } from '@chakra-ui/react';
import { IconSearch } from '@tabler/icons';
import React from 'react';

interface Props {
	searchInput: { search: string; conference: string; year: string };
	handleFilter: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
	handleReset: () => void;
}

const FilterPapers = ({ searchInput, handleFilter, handleReset }: Props) => {
	return (
		<div className="mb-8 mt-3">
			<InputGroup>
				<InputLeftElement pointerEvents="none" children={<IconSearch />} />
				<Input
					name="search"
					value={searchInput.search}
					onChange={(e) => handleFilter(e)}
					variant="outline"
					placeholder="Title or keyword"
				/>
			</InputGroup>

			<div className="mt-4 flex flex-row justify-between">
				<Flex gap={6}>
					<Box>
						<Select
							name="conference"
							value={searchInput.conference}
							onChange={(e) => handleFilter(e)}
							placeholder="Conference"
						>
							<option value="SPLASH">SPLASH</option>
							<option value="MPLR">MPLR</option>
						</Select>
					</Box>
					<Box>
						<Select
							name="year"
							value={searchInput.year}
							onChange={(e) => handleFilter(e)}
							placeholder="Year"
						>
							<option value="2019">2019</option>
							<option value="2020">2020</option>
							<option value="2021">2021</option>
						</Select>
					</Box>
				</Flex>
				<Box>
					<Button onClick={handleReset}>Clear all</Button>
				</Box>
			</div>
		</div>
	);
};

export default FilterPapers;
