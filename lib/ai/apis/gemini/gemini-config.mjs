import {GoogleGenerativeAI} from '@google/generative-ai';

let _geminiAI = null;

export const getGeminiAI = () => {
	if (!_geminiAI) {
		const apiKey = process.env.GEMINI_API_KEY;
		if (!apiKey) {
			throw new Error('GEMINI_API_KEY environment variable is not set');
		}
		_geminiAI = new GoogleGenerativeAI(apiKey);
	}
	return _geminiAI;
};

export const geminiAI = new Proxy(
	{},
	{
		get(target, prop) {
			return getGeminiAI()[prop];
		}
	}
);

export const geminiModel = 'gemini-2.0-flash-exp';
export const geminiEmbeddingModel = 'text-embedding-004';
