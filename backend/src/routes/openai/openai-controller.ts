import { Configuration, OpenAIApi } from 'openai';
import { ParameterizedContext } from 'koa';
import HttpStatus from 'http-status';

const configuration = new Configuration({
	apiKey: process.env.OPENAI_SECRET,
});

const openai = new OpenAIApi(configuration);

const generatePrompt = (
	abstract: string,
): string => `Can you summarise the following text as if it was going to be used in a short tweet.
    ${abstract}
    `;

export const getOpenai = async (ctx: ParameterizedContext): Promise<void> => {
	if (!configuration.apiKey) {
		ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
		console.error('OpenAI API key not configured');
		return;
	}

	const abstract: string = ctx.request.body;
	if (abstract.trim().length === 0) {
		ctx.status = HttpStatus.BAD_REQUEST;
		console.error('Please enter a valid abstract');
		return;
	}

	try {
		const completion = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: generatePrompt(abstract),
			temperature: 0.6,
		});
		ctx.status = HttpStatus.OK;
		ctx.body = completion.data.choices[0].text;
		console.log(completion.data.choices[0].text);
	} catch (error) {
		if (error.response) {
			console.log(error.response);
		} else {
			ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
			console.error('An error occurred during your request.');
		}
	}
};
