import { Paper } from '../types';
import { usePapers } from '../api/getPapers';

const PapersList = () => {
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
					<small className="text-slate-700">{paper.authors.join(', ')}</small>
				</header>
				<div className="content pt-4">
					<p>{paper.shortAbstract}</p>
				</div>
			</div>
		);
	});

	return <div className="grid gap-4">{displayPapers}</div>;
};

export default PapersList;
