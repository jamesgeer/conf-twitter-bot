import { Papers } from '../types';
import { getFilteredPapers, usePapers } from '../api/getPapers';
import FilterPapers from './FilterPapers';
import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import PapersTable from './PapersTable';
import { useOutletContext } from 'react-router-dom';

const PaperSearch = () => {
	const [results, setResults] = useState<Papers>();
	const [searchInput, setSearchInput] = useState({
		search: '',
		source: '',
	});

	//need to take tweetContentRef not useActive aswell
	const context: any = useOutletContext();
	const tweetContentRef: React.RefObject<HTMLTextAreaElement> = context.tweetContentRef;

	const { isLoading, error, data: papers } = usePapers();

	useEffect(() => {
		const getData = async () => {
			let filteredPaperData;

			if (searchInput.search !== '' || searchInput.source !== '') {
				filteredPaperData = await getFilteredPapers(searchInput);
			} else {
				filteredPaperData = papers;
			}

			setResults(filteredPaperData);
		};

		getData().catch(console.error);
	}, [searchInput, papers]);

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
			<PapersTable papers={results ? results : papers} tweetContentRef={tweetContentRef} />
		</>
	);
};

export default PaperSearch;
