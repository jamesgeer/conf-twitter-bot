import { Paper } from '../types';

interface Props {
	paper: Paper;
}

const PapersTableExpanded = ({ paper }: Props) => {
	return (
		<>
			<p className="text-red-600">{paper.source}</p>
		</>
	);
};

export default PapersTableExpanded;
