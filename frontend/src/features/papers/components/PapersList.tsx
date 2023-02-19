import { AcmPaper, RschrPaper, Papers } from '../types';
import { getFilteredPapers, usePapers } from '../api/getPapers';
import FilterPapers from './FilterPapers';
import React, { useEffect, useState } from 'react';
import Paper from './Paper';
import uuid from 'react-uuid';
import { debounce } from 'lodash';

const PapersList = () => {
	const [results, setResults] = useState<Papers>();
	const [searchInput, setSearchInput] = useState({
		search: '',
		source: '',
	});

	const { isLoading, error, data } = usePapers();

	useEffect(() => {
		const getData = async () => {
			const filteredPaperData = await getFilteredPapers(searchInput);
			setResults(filteredPaperData);
		};

		if (searchInput.search !== '' || searchInput.source !== '') {
			getData().catch(console.error);
		}
	}, [searchInput]);

	if (isLoading) {
		return <div>Loading Papers...</div>;
	}

	if (error) {
		return <div>An error occurred: {error.message}</div>;
	}

	if (data.length === 0) {
		return <p>No papers to display.</p>;
	}

	const handleFilter = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setSearchInput({ ...searchInput, [name]: value });
	};

	const debouncedHandleFilter = debounce(handleFilter, 300);

	return (
		<>
			<FilterPapers setSearchInput={setSearchInput} debouncedHandleFilter={debouncedHandleFilter} />
			{data?.map((paper: AcmPaper | RschrPaper) => (
				<Paper key={uuid()} paper={paper} />
			))}
		</>
	);
};

export default PapersList;
