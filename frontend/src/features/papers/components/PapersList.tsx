import { Paper as PaperType, Papers } from '../types';
import Paper from './Paper';
import uuid from 'react-uuid';
import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';

interface Props {
	papers: Papers;
}

const PapersList = ({ papers }: Props) => {
	if (papers.length === 0) {
		return <p>No papers to display.</p>;
	}

	const paperList = papers.map((paper: PaperType) => <Paper key={uuid()} paper={paper} />);

	return (
		<SimpleGrid columns={1} spacing={5}>
			{paperList}
		</SimpleGrid>
	);
};

export default PapersList;
