import { InputGroup, InputLeftElement, Input, Select, Box, Button, Flex } from '@chakra-ui/react';
import { IconSearch } from '@tabler/icons';
import React, { useRef } from 'react';

interface Props {
	searchInput: { search: string; source: string; year: string };
	setSearchInput: React.Dispatch<React.SetStateAction<{ search: string; source: string; year: string }>>;
	debouncedHandleFilter: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const FilterPapers = ({ searchInput, setSearchInput, debouncedHandleFilter }: Props) => {
	const refSearch = useRef<HTMLInputElement>(null);
	const refSource = useRef<HTMLSelectElement>(null);
	const refYear = useRef<HTMLSelectElement>(null);

	const handleReset = () => {
		setSearchInput({
			search: '',
			source: '',
			year: '',
		});

		if (refSearch.current && refSource.current && refYear.current) {
			refSearch.current.value = '';
			refSource.current.value = '';
			refYear.current.value = '';
		}
	};

	return (
		<div className="mb-8 mt-3">
			<InputGroup>
				<InputLeftElement pointerEvents="none" children={<IconSearch />} />
				<Input
					name="search"
					ref={refSearch}
					// value={searchInput.search}
					onChange={(e) => debouncedHandleFilter(e)}
					variant="outline"
					placeholder="Title or keyword"
				/>
			</InputGroup>

			<div className="mt-4 flex flex-row justify-between">
				<Flex gap={6}>
					<Box>
						<Select
							name="source"
							ref={refSource}
							// value={searchInput.source}
							onChange={(e) => debouncedHandleFilter(e)}
							placeholder="Source"
						>
							<option value="acm">ACM</option>
							<option value="rschr">Researchr</option>
						</Select>
					</Box>
					<Box>
						<Select
							name="year"
							ref={refYear}
							// value={searchInput.year}
							onChange={(e) => debouncedHandleFilter(e)}
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
