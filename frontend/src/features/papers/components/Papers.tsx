import { AcmPaper, RschrPaper } from '../types';
import { usePapers } from '../api/getPapers';
import { IconFileDescription } from '@tabler/icons';
import { Button } from '@chakra-ui/react';

interface Props {
	isList: { activeLayout: string };
}

const Papers = ({ isList }: Props) => {
	const { isLoading, error, data: papers } = usePapers();

	if (isLoading) {
		return <div>Loading Papers...</div>;
	}

	if (error) {
		return <div>An error occurred: {error.message}</div>;
	}

	const displayPapers = papers.map((paper: AcmPaper | RschrPaper, index) => {
		return (
			<div key={index} className="border-b border-slate-200 pb-4">
				<header>
					<h5 className="font-bold">{paper.title}</h5>
					<small className="text-slate-700 dark:text-slate-400">{paper.authors.join(', ')}</small>
				</header>
				<div className="content pt-4">
					<p>{paper.shortAbstract.length > 270 ? paper.shortAbstract.substring(0,270) + '...' : paper.shortAbstract}</p>
				</div>
				<div>
					<a href={paper.url} target="_blank" rel="noreferrer">
						<Button>
							<IconFileDescription />
						</Button>
					</a>
				</div>
			</div>
		);
	});

	return (
		<>
			{papers.length > 0 ? (
				<div
					className={
						isList.activeLayout === 'list' ? 'grid gap-4' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
					}
				>
					{displayPapers}
				</div>
			) : (
				<p>No papers to display.</p>
			)}
		</>
	);
};

export default Papers;
