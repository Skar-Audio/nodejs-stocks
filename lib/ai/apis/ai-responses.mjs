import {aiProviderFactory} from './base/ai-provider-factory.mjs';
import {OpenAIProvider} from './openai/openai-provider.mjs';
import {GeminiProvider} from './gemini/gemini-provider.mjs';
import {AnthropicProvider} from './anthropic/anthropic-provider.mjs';
import {openAiModel} from './openai/openai-config.mjs';
import {geminiModel} from './gemini/gemini-config.mjs';
import {anthropicModel} from './anthropic/anthropic-config.mjs';

// Initialize providers on module load
let providersInitialized = false;

/**
 * Initialize all AI providers
 */
export const initializeProviders = () => {
	if (providersInitialized) return;

	try {
		// Register OpenAI provider
		try {
			aiProviderFactory.registerProvider('openai', OpenAIProvider, {
				defaultModel: openAiModel
			});
		} catch (openaiError) {
			console.log('⚠️ OpenAI provider not available:', openaiError.message);
		}

		// Register Gemini provider
		try {
			aiProviderFactory.registerProvider('gemini', GeminiProvider, {
				defaultModel: geminiModel
			});
		} catch (geminiError) {
			console.log('⚠️ Gemini provider not available:', geminiError.message);
		}

		// Register Anthropic provider
		try {
			aiProviderFactory.registerProvider('anthropic', AnthropicProvider, {
				defaultModel: anthropicModel
			});
		} catch (anthropicError) {
			console.log('⚠️ Anthropic provider not available:', anthropicError.message);
		}

		// Set the default provider based on environment or config
		const defaultProvider = process.env.DEFAULT_AI_PROVIDER || 'openai';
		const availableProviders = aiProviderFactory.listProviders();

		// Use default if available, otherwise fall back to first available
		if (availableProviders.includes(defaultProvider)) {
			aiProviderFactory.setDefaultProvider(defaultProvider);
			aiProviderFactory.setCurrentProvider(defaultProvider);
		} else if (availableProviders.length > 0) {
			aiProviderFactory.setDefaultProvider(availableProviders[0]);
			aiProviderFactory.setCurrentProvider(availableProviders[0]);
		}

		providersInitialized = true;
		console.log(
			`🚀 AI providers initialized. Available: ${availableProviders.join(', ')}. Default: ${aiProviderFactory.defaultProvider}`
		);
	} catch (error) {
		console.error('Failed to initialize AI providers:', error);
	}
};

export const submitToAIProvider = async (params) => {
	initializeProviders();

	// Allow provider override per request
	if (params.provider) {
		const originalProvider = aiProviderFactory.currentProvider;
		try {
			aiProviderFactory.setCurrentProvider(params.provider);
			const cleanParams = {...params};
			delete cleanParams.provider;
			const response = await aiProviderFactory.submitRequest(cleanParams);
			aiProviderFactory.setCurrentProvider(originalProvider);
			return response;
		} catch (error) {
			aiProviderFactory.setCurrentProvider(originalProvider);
			throw error;
		}
	}

	return await aiProviderFactory.submitRequest(params);
};

export const generateEmbedding = async (params) => {
	initializeProviders();

	if (params.provider) {
		const originalProvider = aiProviderFactory.currentProvider;
		try {
			aiProviderFactory.setCurrentProvider(params.provider);
			const cleanParams = {...params};
			delete cleanParams.provider;
			const response = await aiProviderFactory.submitEmbeddingRequest(cleanParams);
			aiProviderFactory.setCurrentProvider(originalProvider);
			return response;
		} catch (error) {
			aiProviderFactory.setCurrentProvider(originalProvider);
			throw error;
		}
	}

	return await aiProviderFactory.submitEmbeddingRequest(params);
};

/**
 * Switch the default AI provider at runtime
 * @param {string} providerName - Provider to switch to ('openai', 'gemini', 'anthropic')
 */
export const switchAIProvider = (providerName) => {
	initializeProviders();
	aiProviderFactory.setCurrentProvider(providerName);
};

/**
 * Get current AI provider name
 * @returns {string} - Current provider name
 */
export const getCurrentAIProvider = () => {
	initializeProviders();
	const provider = aiProviderFactory.getCurrentProvider();
	return provider.providerName;
};

/**
 * List available AI providers
 * @returns {Array<string>} - Array of provider names
 */
export const listAIProviders = () => {
	initializeProviders();
	return aiProviderFactory.listProviders();
};
