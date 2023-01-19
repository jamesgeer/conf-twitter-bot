import { InputGroup, InputLeftElement, Input, Select, Box } from '@chakra-ui/react';
import { IconSearch } from '@tabler/icons';
import React from 'react';
import { useSearchPapers } from '../api/getPapers';

interface Props {
	searchInput: { search: string; conference: string; year: string };
	setSearchInput: React.Dispatch<React.SetStateAction<{ search: string; conference: string; year: string }>>;
}

const FilterPapers = ({ searchInput, setSearchInput }: Props) => {
	const { isLoading, error, data: papers } = useSearchPapers(searchInput);
	console.log(papers);

	return (
		<div className="mb-4 mt-3">
			<p>{searchInput.search}</p>
			<p>{searchInput.year}</p>
			<p>{searchInput.conference}</p>
			<InputGroup>
				<InputLeftElement pointerEvents="none" children={<IconSearch />} />
				<Input name="search" onChange={handleSearchChange} variant="outline" placeholder="Title or keyword" />
			</InputGroup>

			<div className="mt-4 flex flex-row gap-6">
				<Box w="20%">
					<Select name="conference" onChange={handleSearchChange} placeholder="Conference">
						<option value="SPLASH">SPLASH</option>
						<option value="MPLR">MPLR</option>
					</Select>
				</Box>
				<Box w="20%">
					<Select name="year" onChange={handleSearchChange} placeholder="Year">
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
