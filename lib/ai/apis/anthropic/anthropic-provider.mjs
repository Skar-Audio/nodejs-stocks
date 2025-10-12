import {AIProviderInterface} from '../base/ai-provider-interface.mjs';
import {anthropicClient, anthropicModel} from './anthropic-config.mjs';
import {consoleLogRedWhite} from '../../../color-logging.mjs';

/**
 * Anthropic (Claude) Provider implementation
 */
export class AnthropicProvider extends AIProviderInterface {
	constructor(config = {}) {
		super(config);
		this.providerName = 'anthropic';
		this.defaultModel = config.defaultModel || anthropicModel;
	}

	validateConfig() {
		try {
			const client = anthropicClient;
			if (!client) {
				throw new Error('Anthropic client could not be initialized');
			}
		} catch (error) {
			throw new Error(`Anthropic configuration error: ${error.message}`);
		}
	}

	convertParams(params) {
		const anthropicParams = {
			model: params.model || this.defaultModel,
			max_tokens: params.max_tokens || params.maxTokens || 4096,
			temperature: params.temperature,
			top_p: params.top_p || params.topP
		};

		// Convert messages to Anthropic format
		if (params.messages) {
			const {system, messages} = this.convertMessagesToAnthropicFormat(params.messages);
			anthropicParams.messages = messages;
			if (system) {
				anthropicParams.system = system;
			}
		}

		// Remove undefined values
		Object.keys(anthropicParams).forEach((key) => {
			if (anthropicParams[key] === undefined) {
				delete anthropicParams[key];
			}
		});

		return anthropicParams;
	}

	/**
	 * Convert OpenAI-style messages to Anthropic format
	 * Anthropic separates system messages from user/assistant messages
	 */
	convertMessagesToAnthropicFormat(messages) {
		let system = null;
		const anthropicMessages = [];

		for (const msg of messages) {
			if (msg.role === 'system') {
				// Anthropic uses a separate system parameter
				system = msg.content;
			} else if (msg.role === 'user' || msg.role === 'assistant') {
				anthropicMessages.push({
					role: msg.role,
					content: msg.content
				});
			}
		}

		return {system, messages: anthropicMessages};
	}

	normalizeResponse(response) {
		// Convert Anthropic response to OpenAI-compatible format
		const content = response.content[0]?.text || '';

		return {
			choices: [
				{
					message: {
						role: 'assistant',
						content: content
					},
					index: 0,
					finish_reason: response.stop_reason || 'stop'
				}
			],
			model: response.model,
			usage: {
				prompt_tokens: response.usage?.input_tokens || 0,
				completion_tokens: response.usage?.output_tokens || 0,
				total_tokens: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)
			}
		};
	}

	async generateChatCompletion(params) {
		try {
			const anthropicParams = this.convertParams(params);

			const logObject = params.fnName
				? {[`[${params.fnName}] → Anthropic API params`]: anthropicParams}
				: {Anthropic_API_params: anthropicParams};
			console.dir(logObject, {depth: 2});

			const response = await anthropicClient.messages.create(anthropicParams);

			return this.normalizeResponse(response);
		} catch (error) {
			consoleLogRedWhite('[Anthropic] Chat completion error:', error);
			throw error;
		}
	}

	async generateEmbedding(params) {
		// Anthropic doesn't have a native embedding API
		// You would need to use a different service or return an error
		throw new Error(
			'Anthropic does not support embeddings. Use OpenAI or Gemini for embeddings.'
		);
	}

	getAvailableModels() {
		return {
			chat: [
				'claude-3-5-sonnet-20241022',
				'claude-3-5-haiku-20241022',
				'claude-3-opus-20240229',
				'claude-3-sonnet-20240229',
				'claude-3-haiku-20240307'
			],
			embedding: []
		};
	}
}
