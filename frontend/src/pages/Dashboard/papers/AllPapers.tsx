import axios from 'axios';
import { Paper, Papers } from '../../../types';
import { useEffect, useState } from 'react';

const AllPapers = () => {
	const [papers, setPapers] = useState<Papers>([]);

	useEffect(() => {
		if (papers.length === 0) {
			getPapers().then();
		}
	}, [papers]);

	const getPapers = async () => {
		try {
			const response = await axios.get('/api/papers');
			setPapers(response.data);
		} catch (error) {
			console.error(error);
		}
	};

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

export default AllPapers;
