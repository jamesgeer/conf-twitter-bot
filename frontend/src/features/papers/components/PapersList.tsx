import { Paper as PaperType, Papers } from '../types';
import { getFilteredPapers, usePapers } from '../api/getPapers';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from './DataTable';
import FilterPapers from './FilterPapers';
import React, { useEffect, useState } from 'react';
import Paper from './Paper';
import uuid from 'react-uuid';

interface Props {
	isList: { activeLayout: string };
}

const PapersList = ({ isList }: Props) => {
	// const [papers, setPapers] = useState<Papers>();
	const [results, setResults] = useState<Papers>();
	const [searchInput, setSearchInput] = useState({
		search: '',
		conference: '',
		year: '',
	});

	const { isLoading, error, data } = usePapers();

	// useEffect(() => {
	//	setPapers(data);
	//  }, [data]);

	useEffect(() => {
		const getData = async () => {
			const filteredPaperData = await getFilteredPapers(searchInput);
			setResults(filteredPaperData);
		};
		if (searchInput.search !== '' || searchInput.year !== '' || searchInput.conference !== '') {
			getData().catch(console.error);
		}
	}, [searchInput]);

	if (isLoading) {
		return <div>Loading Papers...</div>;
	}

	if (error) {
		return <div>An error occurred: {error.message}</div>;
	}

	console.count('Rerender: ');

	const handleFilter = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setSearchInput({ ...searchInput, [name]: value });
	};

	//move to types folder?
	type PaperRowData = {
		title: string;
		conference: string;
		year: string;
	};

	const defaultData: PaperRowData[] = [
		{
			title: 'A graphical language for flexible inference in robotics and vision (invited talk)',
			conference: 'SPLASH',
			year: '2019',
		},
		{
			title: 'trcview: interactive architecture agnostic execution trace analysis',
			conference: 'MPLR',
			year: '2020',
		},
		{
			title: 'Using machine learning to predict the code size impact of duplication heuristics in a dynamic compiler',
			conference: 'MPLR',
			year: '2021',
		},
	];

	const columnHelper = createColumnHelper<PaperType>();

	const columns = [
		columnHelper.accessor('title', {
			cell: (info) => info.getValue(),
			header: 'Title',
			sortingFn: 'alphanumeric',
		}),
		columnHelper.accessor('monthYear', {
			cell: (info) => info.getValue(),
			header: 'Year',
			sortingFn: 'alphanumeric',
		}),
	];

	return (
		<>
			{data && data.length > 0 ? (
				isList.activeLayout === 'list' ? (
					<>
						<FilterPapers searchInput={searchInput} handleFilter={handleFilter} />
						<DataTable
							columns={columns}
							data={
								searchInput.search === '' && searchInput.conference === '' && searchInput.year === ''
									? data
									: results!
							}
						/>
					</>
				) : (
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{data?.map((paper: PaperType) => (
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
