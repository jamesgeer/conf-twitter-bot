import { useLocation, useParams } from 'react-router-dom';
import { Paper as PaperType, Papers } from '../types';
import { useOutletContext } from 'react-router-dom';
import { getAuthorsPapers } from '../api/getPapers';
import PapersList from './PapersList';
import { useEffect, useState } from 'react';
import PapersTable from './PapersTable';

interface AuthorState {
	paperId: number;
	authorIndex: number;
}

const AuthorPapers = () => {
	const { author } = useParams();
	const { state }: any = useLocation();
	const { paperId, authorIndex }: AuthorState = state;

	const setActive = useOutletContext<
		React.Dispatch<
			React.SetStateAction<{
				index: number;
				title: string;
			}>
		>
	>();

	const [authorPapers, setAuthorPapers] = useState<Papers>();

	const formatName = (author: string): string => {
		const authorFormatted = author.replace(/-/g, ' ');
		const name = authorFormatted.split(' ');

		for (let i = 0; i < name.length; i++) {
			name[i] = name[i][0].toUpperCase() + name[i].substring(1);
		}

		const authorParam = name.join(' ');
		return authorParam;
	};

	// hardcoded index for now
	const modifyTitle = () => setActive({ index: 1, title: 'Papers: ' + formatName(author!) });

	useEffect(() => {
		const getData = async () => {
			const filteredPaperData = await getAuthorsPapers(paperId, authorIndex);
			setAuthorPapers(filteredPaperData);
		};

		getData().catch(console.error);
		modifyTitle();
	}, [author]);

	return <PapersTable papers={authorPapers ? authorPapers : []} />;
};

export default AuthorPapers;
