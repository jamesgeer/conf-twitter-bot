import { Papers } from '../types';
import { getFilteredPapers, usePapers } from '../api/getPapers';
import FilterPapers from './FilterPapers';
import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import PaperList from './PaperList';

const PaperSearch = () => {
	const [results, setResults] = useState<Papers>();
	const [searchInput, setSearchInput] = useState({
		search: '',
		source: '',
	});

	const { isLoading, error, data: papers } = usePapers();

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

	const handleFilter = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setSearchInput({ ...searchInput, [name]: value });
	};

	const debouncedHandleFilter = debounce(handleFilter, 300);

	return (
		<>
			<FilterPapers setSearchInput={setSearchInput} debouncedHandleFilter={debouncedHandleFilter} />
			<PaperList papers={results ? results : papers} />
		</>
	);
};

export default PaperSearch;
