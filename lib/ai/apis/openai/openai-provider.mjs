import {AIProviderInterface} from '../base/ai-provider-interface.mjs';
import {openAi, openAiModel} from './openai-config.mjs';
import {consoleLogRedWhite} from '../../../color-logging.mjs';

/**
 * OpenAI Provider implementation
 */
export class OpenAIProvider extends AIProviderInterface {
	constructor(config = {}) {
		super(config);
		this.providerName = 'openai';
		this.defaultModel = config.defaultModel || openAiModel;
		this.defaultEmbeddingModel = config.defaultEmbeddingModel || 'text-embedding-ada-002';
	}

	validateConfig() {
		try {
			const client = openAi;
			if (!client) {
				throw new Error('OpenAI client could not be initialized');
			}
		} catch (error) {
			throw new Error(`OpenAI configuration error: ${error.message}`);
		}
	}

	convertParams(params) {
		const model = params.model || this.defaultModel;

		const useMaxCompletionTokens = model && (model.includes('o1') || model.includes('o3'));

		const openAIParams = {
			model: model,
			messages: params.messages || [],
			temperature: params.temperature,
			top_p: params.top_p || params.topP,
			frequency_penalty: params.frequency_penalty,
			presence_penalty: params.presence_penalty,
			stream: params.stream || false
		};

		const maxTokenValue = params.max_tokens || params.maxTokens;
		if (maxTokenValue) {
			if (useMaxCompletionTokens) {
				openAIParams.max_completion_tokens = maxTokenValue;
			} else {
				openAIParams.max_tokens = maxTokenValue;
			}
		}

		if (!openAIParams.messages.length && params.input) {
			openAIParams.messages = params.input;
		}

		if (!openAIParams.messages.length) {
			if (params.system || params.user) {
				openAIParams.messages = [
					{role: 'system', content: params.system || ''},
					{role: 'user', content: params.user || ''}
				];
			}
		}

		Object.keys(openAIParams).forEach((key) => {
			if (openAIParams[key] === undefined) {
				delete openAIParams[key];
			}
		});

		return openAIParams;
	}

	normalizeResponse(response) {
		return response;
	}

	async generateChatCompletion(params) {
		try {
			const openAIParams = this.convertParams(params);

			const logObject = params.fnName
				? {[`[${params.fnName}] → OpenAI API params`]: openAIParams}
				: {OpenAI_API_params: openAIParams};
			console.dir(logObject, {depth: 2});

			const response = await openAi.chat.completions.create(openAIParams);

			return this.normalizeResponse(response);
		} catch (error) {
			consoleLogRedWhite('[OpenAI] Chat completion error:', error);
			throw error;
		}
	}

	async generateEmbedding(params) {
		try {
			const embeddingParams = {
				model: params.model || this.defaultEmbeddingModel,
				input: params.input
			};

			const response = await openAi.embeddings.create(embeddingParams);

			return response;
		} catch (error) {
			consoleLogRedWhite('[OpenAI] Embedding error:', error);
			throw error;
		}
	}

	getAvailableModels() {
		return {
			chat: [
				'gpt-4o',
				'gpt-4o-mini',
				'gpt-4-turbo',
				'gpt-4',
				'gpt-3.5-turbo',
				'o1',
				'o1-mini',
				'o3-mini'
			],
			embedding: ['text-embedding-ada-002', 'text-embedding-3-small', 'text-embedding-3-large']
		};
	}
}
