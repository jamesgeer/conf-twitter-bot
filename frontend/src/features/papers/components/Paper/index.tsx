import { Paper as PaperType } from '../../types';
import { IconFileDescription, IconTrash } from '@tabler/icons';
import { Button } from '@chakra-ui/react';
import React from 'react';

interface Props {
	paper: PaperType;
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
				</a>
			</div>
		</div>
	);
};

export default Paper;
