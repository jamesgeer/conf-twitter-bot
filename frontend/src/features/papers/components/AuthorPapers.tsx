import { useParams } from 'react-router-dom';
import { Paper as PaperType, Papers } from '../types';
import { useOutletContext } from 'react-router-dom';
import { getAuthorsPapers } from '../api/getPapers';
import PaperList from './PaperList';
import { useEffect, useState } from 'react';

const AuthorPapers = () => {
	const { author } = useParams();
	//const title = useOutletContext<string>();
	const [authorPapers, setAuthorPapers] = useState<Papers>();

	useEffect(() => {
		const getData = async () => {
			const filteredPaperData = await getAuthorsPapers(author!);
			setAuthorPapers(filteredPaperData);
		};

		getData().catch(console.error);
	}, [author]);

	return <PaperList papers={authorPapers ? authorPapers : []} />;
};

export default AuthorPapers;
