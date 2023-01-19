import { InputGroup, InputLeftElement, Input, Select, Box } from '@chakra-ui/react';
import { IconSearch } from '@tabler/icons';
import React from 'react';

interface Props {
	searchInput: { search: string; conference: string; year: string };
	handleFilter: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const FilterPapers = ({ searchInput, handleFilter }: Props) => {
	return (
		<div className="mb-4 mt-3">
			<p>{searchInput.search}</p>
			<p>{searchInput.year}</p>
			<p>{searchInput.conference}</p>
			<InputGroup>
				<InputLeftElement pointerEvents="none" children={<IconSearch />} />
				<Input
					name="search"
					onChange={(e) => handleFilter(e)}
					variant="outline"
					placeholder="Title or keyword"
				/>
			</InputGroup>

			<div className="mt-4 flex flex-row gap-6">
				<Box w="20%">
					<Select name="conference" onChange={(e) => handleFilter(e)} placeholder="Conference">
						<option value="SPLASH">SPLASH</option>
						<option value="MPLR">MPLR</option>
					</Select>
				</Box>
				<Box w="20%">
					<Select name="year" onChange={(e) => handleFilter(e)} placeholder="Year">
						<option value="2019">2019</option>
						<option value="2020">2020</option>
						<option value="2021">2021</option>
					</Select>
				</Box>
			</div>
		</div>
	);
};

export default FilterPapers;
