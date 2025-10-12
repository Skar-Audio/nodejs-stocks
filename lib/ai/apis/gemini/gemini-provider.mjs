import {AIProviderInterface} from '../base/ai-provider-interface.mjs';
import {geminiAI, geminiEmbeddingModel, geminiModel} from './gemini-config.mjs';
import {consoleLogRedWhite} from '../../../color-logging.mjs';

/**
 * Gemini AI Provider implementation
 */
export class GeminiProvider extends AIProviderInterface {
	constructor(config = {}) {
		super(config);
		this.providerName = 'gemini';
		this.defaultModel = config.defaultModel || geminiModel;
		this.defaultEmbeddingModel = config.defaultEmbeddingModel || geminiEmbeddingModel;
	}

	validateConfig() {
		const apiKey = process.env.GEMINI_API_KEY || this.config.apiKey;
		if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
			throw new Error('Gemini API key not configured. Set GEMINI_API_KEY environment variable.');
		}
	}

	convertParams(params) {
		const geminiParams = {
			model: params.model || this.defaultModel,
			generationConfig: {}
		};

		if (params.temperature !== undefined) {
			geminiParams.generationConfig.temperature = params.temperature;
		}
		if (params.maxTokens !== undefined) {
			geminiParams.generationConfig.maxOutputTokens = params.maxTokens;
		}
		if (params.max_tokens !== undefined) {
			geminiParams.generationConfig.maxOutputTokens = params.max_tokens;
		}
		if (params.topP !== undefined) {
			geminiParams.generationConfig.topP = params.topP;
		}
		if (params.top_p !== undefined) {
			geminiParams.generationConfig.topP = params.top_p;
		}

		if (params.messages) {
			geminiParams.contents = this.convertMessagesToGeminiFormat(params.messages);
		}

		return geminiParams;
	}

	convertMessagesToGeminiFormat(messages) {
		const contents = [];
		let systemInstruction = null;

		for (const msg of messages) {
			if (msg.role === 'system') {
				systemInstruction = msg.content;
			} else if (msg.role === 'user') {
				contents.push({
					role: 'user',
					parts: [{text: msg.content}]
				});
			} else if (msg.role === 'assistant') {
				contents.push({
					role: 'model',
					parts: [{text: msg.content}]
				});
			}
		}

		if (systemInstruction && contents.length > 0) {
			const firstUserMsg = contents.find((c) => c.role === 'user');
			if (firstUserMsg) {
				firstUserMsg.parts[0].text = `${systemInstruction}\n\n${firstUserMsg.parts[0].text}`;
			}
		}

		return contents;
	}

	normalizeResponse(geminiResponse) {
		try {
			let text = '';

			if (geminiResponse?.response && typeof geminiResponse.response.text === 'function') {
				try {
					text = geminiResponse.response.text();
				} catch (e) {
					// Fallback
				}
			}

			if (!text) {
				text =
					geminiResponse?.text ||
					geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text ||
					'';
			}

			return {
				choices: [
					{
						message: {
							role: 'assistant',
							content: text
						},
						index: 0,
						finish_reason: 'stop'
					}
				],
				model: this.defaultModel,
				usage: geminiResponse?.usageMetadata || {}
			};
		} catch (error) {
			consoleLogRedWhite('[Gemini] Error normalizing response:', error);
			throw error;
		}
	}

	async generateChatCompletion(params) {
		try {
			const geminiParams = this.convertParams(params);

			const model = geminiAI.getGenerativeModel({
				model: geminiParams.model
			});

			const result = await model.generateContent({
				contents: geminiParams.contents,
				generationConfig: geminiParams.generationConfig
			});

			const normalizedResponse = this.normalizeResponse(result);
			return normalizedResponse;
		} catch (error) {
			consoleLogRedWhite('[Gemini] Chat completion error:', error);

			if (error.message?.includes('API key')) {
				throw new Error(
					'Gemini API key is invalid or not set. Please check GEMINI_API_KEY environment variable.'
				);
			}
			if (error.message?.includes('quota')) {
				throw new Error('Gemini API quota exceeded. Please check your usage limits.');
			}

			throw error;
		}
	}

	async generateEmbedding(params) {
		try {
			const model = geminiAI.getGenerativeModel({
				model: params.model || this.defaultEmbeddingModel
			});

			const texts = Array.isArray(params.input) ? params.input : [params.input];

			const embeddings = [];

			for (const text of texts) {
				const result = await model.embedContent(text);
				embeddings.push(result.embedding);
			}

			return {
				data: embeddings.map((embedding, index) => ({
					embedding: embedding.values,
					index: index
				})),
				model: params.model || this.defaultEmbeddingModel,
				usage: {
					total_tokens: texts.join(' ').split(' ').length
				}
			};
		} catch (error) {
			consoleLogRedWhite('[Gemini] Embedding error:', error);
			throw error;
		}
	}

	getAvailableModels() {
		return {
			chat: [
				'gemini-1.5-flash',
				'gemini-1.5-flash-8b',
				'gemini-1.5-pro',
				'gemini-2.0-flash-exp'
			],
			embedding: ['text-embedding-004']
		};
	}
}
