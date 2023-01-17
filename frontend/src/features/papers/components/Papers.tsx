import { Paper } from '../types';
import { usePapers } from '../api/getPapers';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from './DataTable';
import FilterInputs from './FilterInputs';
import { useState } from 'react';

interface Props {
	isList: { activeLayout: string };
}

const Papers = ({ isList }: Props) => {
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

	const displayPapers = papers.map((paper: Paper, index) => {
		return (
			<div key={index} className="border-b border-slate-200 pb-4">
				<header>
					<h5 className="font-bold">{paper.title}</h5>
					<small className="text-slate-700 dark:text-slate-400">{paper.authors.join(', ')}</small>
				</header>
				<div className="content pt-4">
					<p>{paper.shortAbstract}</p>
				</div>
			</div>
		);
	});

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
						<FilterInputs searchInput={searchInput} setSearchInput={setSearchInput} />
						<DataTable columns={columns} data={defaultData} />
					</>
				) : (
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{displayPapers}</div>
				)
			) : (
				<p>No papers to display.</p>
			)}
		</>
	);
};

export default Papers;
