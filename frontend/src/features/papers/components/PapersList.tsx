import { useEffect, useState } from 'react';
import { Paper, Papers } from '../types';
import { getPapers } from '../api/getPapers';

const PapersList = () => {
	const [papers, setPapers] = useState<Papers>([]);

	useEffect(() => {
		if (papers.length === 0) {
			getPapers().then((papers) => setPapers(papers));
		}
	}, [papers]);

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
