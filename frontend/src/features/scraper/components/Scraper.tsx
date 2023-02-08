import {Box,Textarea, Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Button,} from '@chakra-ui/react';
import axios from "axios";
import React, { useState} from "react";
import {useScrapeHistory} from "../api/getScrapeHistory";
import {ScrapeHistoryElm} from "../types";

interface urls {
	urls: string,
}

let initialState: urls = {
	urls: "",
}
/* for testing
* https://dl.acm.org/doi/proceedings/10.1145/3475738
https://dl.acm.org/doi/proceedings/10.1145/3426182
https://dl.acm.org/doi/proceedings/10.1145/3357390
https://dl.acm.org/doi/proceedings/10.1145/3237009
https://dl.acm.org/doi/proceedings/10.1145/3132190
https://dl.acm.org/doi/proceedings/10.1145/2972206
https://dl.acm.org/doi/proceedings/10.1145/2807426
https://dl.acm.org/doi/proceedings/10.1145/2647508
https://dl.acm.org/doi/proceedings/10.1145/2500828
https://dl.acm.org/doi/proceedings/10.1145/2093157
https://dl.acm.org/doi/proceedings/10.1145/1852761
https://dl.acm.org/doi/proceedings/10.1145/1596655
https://dl.acm.org/doi/proceedings/10.1145/1411732
https://dl.acm.org/doi/proceedings/10.1145/1294325
https://dl.acm.org/doi/proceedings/10.1145/1168054
https://dl.acm.org/doi/proceedings/10.5555/1071565
https://dl.acm.org/doi/proceedings/10.5555/957289
https://dl.acm.org/doi/proceedings/10.5555/638476
* */
const Scraper = () => {
	const [urls, setUrls] = useState<urls>(initialState);
	const [isScraping, setIsScraping] = useState(false);
	let { data: historyData } = useScrapeHistory();
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			setIsScraping(true);
			await axios.post('/api/scraper/', urls);
			setIsScraping(false);
		} catch (error){
			setIsScraping(false);
			console.error(error);
		}


	};



	const onChangeHandler = (event: HTMLTextAreaElement) => {
		const val = event.value;
		setUrls(prevState => {
			return { ...prevState, urls: val }
		});
	}

	const displayHistory = historyData.map((history: ScrapeHistoryElm, index) => {
		return (
			<Tr key={index} style={{whiteSpace: "pre-line"}}>
				<Td>{history.links}</Td>
				<Td>{history.errors}</Td>
				<Td>{history.scrapeDate.toString()}</Td>
				<Td><Button colorScheme='twitter' variant='solid'>Re-scrape</Button></Td>
			</Tr>
		);
	});

	return (
		<Box>
			<form className="flex gap-x-4 relative" onSubmit={(e) => handleSubmit(e)}>
				<Textarea rows={5} placeholder='Paste your links here. Please put each link on a new line!' onChange={(e) => onChangeHandler(e.target)}/>
				<Button isLoading={isScraping} loadingText='Scraping' colorScheme='twitter' variant='solid' type="submit">Start Scraping</Button>
			</form>
			<TableContainer>
				<Table variant='simple' colorScheme='twitter'>
					<TableCaption placement='top'>Web Scraping History</TableCaption>
					<Thead>
						<Tr>
							<Th>Links</Th>
							<Th>Errors</Th>
							<Th>Date</Th>
							<Th>Re-scrape</Th>
						</Tr>
					</Thead>
					<Tbody>
						{displayHistory}
					</Tbody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default Scraper;
