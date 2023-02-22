import { useParams } from 'react-router-dom';
import { Paper as PaperType, Papers } from '../types';
import { useOutletContext } from 'react-router-dom';

const AuthorPapers = () => {
	const { author } = useParams();
	//const title = useOutletContext<string>();

	return <p>{author}</p>;
};

export default AuthorPapers;
