import { Configuration, OpenAIApi } from 'openai';
import HttpStatus from 'http-status';
import { ServerError } from '../types';

const configuration = new Configuration({
	apiKey: process.env.OPENAI_SECRET,
});

const openai = new OpenAIApi(configuration);

const generatePrompt = (
	abstract: string,
): string => `Can you summarise the following text as if it was going to be used in a short tweet.
    ${abstract}
    `;

//https://github.com/openai/openai-quickstart-node/blob/master/pages/api/generate.js

export const getSummary = async (abstract: string): Promise<string | ServerError> => {
	let result = '';
	if (!configuration.apiKey) {
		return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'OpenAI API key not configured');
	}

	if (abstract.trim().length === 0) {
		return new ServerError(HttpStatus.BAD_REQUEST, 'Please enter a valid abstract');
	}

	try {
		const completion = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: generatePrompt(abstract),
			temperature: 0.6,
			max_tokens: 256,
		});

		if (completion.data.choices[0].text) {
			result = completion.data.choices[0].text;
		}

		console.log(completion.data);
	} catch (error) {
		if (error.response) {
			console.log(error.response);
		} else {
			return new ServerError(HttpStatus.INTERNAL_SERVER_ERROR, 'An error occurred during your request.');
		}
	}

	return result;
};
