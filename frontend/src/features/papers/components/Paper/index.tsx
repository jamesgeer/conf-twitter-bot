import { AcmPaper, RschrPaper } from '../../types';
import { IconFileDescription, IconCircleLetterR, IconCircleLetterA } from '@tabler/icons';
import { Button } from '@chakra-ui/react';
import React from 'react';

interface Props {
	paper: AcmPaper | RschrPaper;
}

const Paper = ({ paper }: Props) => {
	const { title, authors, shortAbstract, url } = paper;

	return (
		<div className="border-b border-slate-200 pb-4">
			<header>
				<h5 className="font-bold">{title}</h5>

				<small className="text-slate-700 dark:text-slate-400">{authors.join(', ')}</small>
			</header>
			<div className="content pt-4">
				<p>{shortAbstract}</p>
			</div>
			<div>
				<a href={url} target="_blank" rel="noreferrer">
					<Button>
						<IconFileDescription />
					</Button>
					<Button hidden={paper.source === 'acm'}>
						<IconCircleLetterR />
					</Button>
					<Button hidden={paper.source !== 'acm'}>
						<IconCircleLetterA />
					</Button>
				</a>
			</div>
		</div>
	);
};

export default Paper;
