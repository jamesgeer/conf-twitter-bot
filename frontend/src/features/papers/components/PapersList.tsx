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
	const [papers, setPapers] = useState<Papers>();
	const [results, setResults] = useState<Papers>();
	const [searchInput, setSearchInput] = useState({
		search: '',
		conference: '',
		year: '',
	});

	const { isLoading, error, data } = usePapers();

	useEffect(() => {
		setPapers(data);
	}, [data]);

	if (isLoading) {
		return <div>Loading Papers...</div>;
	}

	if (error) {
		return <div>An error occurred: {error.message}</div>;
	}

	const handleFilter = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setSearchInput({ ...searchInput, [name]: value });

		const results = await getFilteredPapers(searchInput);
		setResults(results);
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

	const columnHelper = createColumnHelper<PaperRowData>();

	const columns = [
		columnHelper.accessor('title', {
			cell: (info) => info.getValue(),
			header: 'Title',
			sortingFn: 'alphanumeric',
		}),
		columnHelper.accessor('conference', {
			cell: (info) => info.getValue(),
			header: 'Conference',
			sortingFn: 'alphanumeric',
		}),
		columnHelper.accessor('year', {
			cell: (info) => info.getValue(),
			header: 'Title',
			sortingFn: 'alphanumeric',
		}),
	];

	return (
		<>
			{papers && papers.length > 0 ? (
				isList.activeLayout === 'list' ? (
					<>
						<FilterPapers searchInput={searchInput} handleFilter={handleFilter} />
						<DataTable columns={columns} data={defaultData} />
					</>
				) : (
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{papers?.map((paper: PaperType) => (
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
