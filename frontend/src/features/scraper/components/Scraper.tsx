import { Textarea } from '@chakra-ui/react';
import axios from "axios";
import React, {useState} from "react";

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

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// todo: Use the returned status to show success / failure
		axios.post('/api/scraper/', urls);

	};

	const onChangeHandler = (event: HTMLTextAreaElement) => {
		const val = event.value;
		setUrls(prevState => {
			return { ...prevState, urls: val }
		});
	}
	return (
		<>
			<div>
				<form className="flex gap-x-4 relative" onSubmit={(e) => handleSubmit(e)}>
					<Textarea rows={15} placeholder='Paste your links here. Please put each link on a new line!' onChange={(e) => onChangeHandler(e.target)}/>
					<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full" type="submit">Scrape</button>
				</form>
			</div>
		</>
	);
};

export default Scraper;
