import OpenAI from 'openai';

let _openAi = null;
export const getOpenAi = () => {
	if (!_openAi) {
		_openAi = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY
		});
	}
	return _openAi;
};

export const openAi = new Proxy(
	{},
	{
		get(target, prop) {
			return getOpenAi()[prop];
		}
	}
);

export const openAiModel = 'gpt-4o';
export const openAiModelMini = 'gpt-4o-mini';
