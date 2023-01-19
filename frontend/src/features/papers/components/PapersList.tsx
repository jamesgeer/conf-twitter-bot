import { Paper as PaperType, Papers } from '../types';
import { getPapers, usePapers, useSearchPapers } from '../api/getPapers';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from './DataTable';
import FilterPapers from './FilterPapers';
import React, { useState } from 'react';
import Paper from './Paper';
import uuid from 'react-uuid';

interface Props {
	isList: { activeLayout: string };
}

const PapersList = ({ isList }: Props) => {
	const [searchInput, setSearchInput] = useState({
		search: '',
		conference: '',
		year: '',
	});

	const { isLoading, error, data: papers } = usePapers();

	if (isLoading) {
		return <div>Loading Papers...</div>;
	}

	if (error) {
		return <div>An error occurred: {error.message}</div>;
	}

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
			{papers.length > 0 ? (
				isList.activeLayout === 'list' ? (
					<>
						<FilterPapers searchInput={searchInput} setSearchInput={setSearchInput} />
						<DataTable columns={columns} data={defaultData} />
					</>
				) : (
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{papers.map((paper: PaperType) => (
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
