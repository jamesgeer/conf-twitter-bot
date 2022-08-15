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
		return <div key={index} className="border-b border-slate-200 pb-4"></div>;
	});

	return <div className="grid gap-4">{displayPapers}</div>;
};

export default AllPapers;
