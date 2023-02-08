import { AcmPaper, RschrPaper, Papers } from '../types';
import { getFilteredPapers, usePapers } from '../api/getPapers';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from './DataTable';
import FilterPapers from './FilterPapers';
import React, { useEffect, useState } from 'react';
import Paper from './Paper';
import uuid from 'react-uuid';
import { debounce } from 'lodash';

interface Props {
	isList: { activeLayout: string };
}

const PapersList = ({ isList }: Props) => {
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

	const handleFilter = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setSearchInput({ ...searchInput, [name]: value });
	};

	const debouncedHandleFilter = debounce(handleFilter, 300);

	const columnHelper = createColumnHelper<AcmPaper | RschrPaper>();

	const columns = [
		columnHelper.accessor('title', {
			cell: (info) => info.getValue(),
			header: 'Title',
			sortingFn: 'alphanumeric',
		}),
		columnHelper.accessor('source', {
			cell: (info) => info.getValue(),
			header: 'Source',
			sortingFn: 'alphanumeric',
		}),
	];

	return (
		<>
			{data && data.length > 0 ? (
				isList.activeLayout === 'list' ? (
					<>
						<FilterPapers setSearchInput={setSearchInput} debouncedHandleFilter={debouncedHandleFilter} />
						<DataTable
							columns={columns}
							data={searchInput.search === '' && searchInput.source === '' ? data : results!}
						/>
					</>
				) : (
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{data?.map((paper: AcmPaper | RschrPaper) => (
							<Paper key={uuid()} paper={paper} />
						))}
					</div>
				)
			) : (
				<p>No papers to display.</p>
			)}
		</>
	);
};

export default PapersList;
