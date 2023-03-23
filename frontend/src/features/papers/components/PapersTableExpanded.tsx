import { Paper } from '../types';
import { Text, Box, Button, Flex, ModalBody, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import PaperModal from './Paper/PaperModal';
import React, { useState } from 'react';
import { IconArrowsDiagonal2, IconSparkles } from '@tabler/icons-react';
import { getAbstractSummary } from '../api/getPapers';

interface Props {
	paper: Paper;
	tweetContentRef: React.RefObject<HTMLTextAreaElement>;
}

const PapersTableExpanded = ({ paper, tweetContentRef }: Props) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [summary, setSummary] = useState('');
	const [isSummarising, setIsSummarising] = useState(false);

	const handleButtonClick = async () => {
		setIsSummarising(true);
		try {
			const summarised = await getAbstractSummary(paper.id.toString());
			setSummary(summarised);
			setIsSummarising(false);
		} catch (e) {
			console.log(e);
		}
	};

	const handleInsertDetails = (e: React.MouseEvent<HTMLElement>) => {
		if (tweetContentRef.current) {
			if (tweetContentRef.current.value.length === 0) {
				tweetContentRef.current.value += e.currentTarget.textContent;
			} else {
				//paper value with two line breaks to seperate content
				tweetContentRef.current.value += '\n \n' + e.currentTarget.textContent;
			}
		}
	};

	return (
		<SimpleGrid columns={2} spacing={10}>
			<Flex direction={'column'} gap={6}>
				<Text onClick={handleInsertDetails} cursor={'pointer'}>
					{paper.title}
				</Text>
				<Text onClick={handleInsertDetails} cursor={'pointer'}>
					{paper.fullAbstract ? paper.fullAbstract : paper.shortAbstract}
				</Text>
				<Box>
					<Button mt={4} mb={4} isLoading={isSummarising} onClick={handleButtonClick}>
						<IconSparkles />
					</Button>
					{summary ? (
						<>
							<Box>
								<Text as="b">Summary: </Text>
							</Box>
							<Text onClick={handleInsertDetails} cursor={'pointer'}>
								{summary}
							</Text>
						</>
					) : (
						''
					)}
				</Box>
			</Flex>
			<Flex direction={'column'} gap={6}>
				<Box onClick={handleInsertDetails} cursor={'pointer'}>
					{paper.monthYear && `Published: ${paper.monthYear},`} {paper.pages && `Pages: ${paper.pages},`}{' '}
					{paper.downloads && `Downloads: ${paper.downloads}`}
				</Box>
				<Box>
					<Button onClick={onOpen}>
						<IconArrowsDiagonal2 />
					</Button>
					{/*<Box>{paperSourceButton()}</Box>*/}
					{/*<Box>{paperModalAuthors()}</Box>*/}
				</Box>
			</Flex>
			{isOpen && <PaperModal paper={paper} isOpen={isOpen} onClose={onClose} />}
		</SimpleGrid>
	);
};

export default PapersTableExpanded;
