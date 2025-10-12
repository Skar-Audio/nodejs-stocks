/**
 * Base interface for AI providers
 * All AI providers (OpenAI, Gemini, Anthropic) must implement this interface
 */
export class AIProviderInterface {
	constructor(config = {}) {
		this.config = config;
		this.providerName = 'base';
	}

	/**
	 * Generate a chat completion response
	 * @param {Object} params - Parameters for the chat completion
	 * @param {Array} params.messages - Array of message objects with role and content
	 * @param {string} params.model - Model identifier
	 * @param {number} params.temperature - Temperature for response generation
	 * @param {number} params.maxTokens - Maximum tokens in response
	 * @param {boolean} params.stream - Whether to stream the response
	 * @returns {Promise<Object>} - Standardized response object
	 */
	async generateChatCompletion(params) {
		throw new Error('generateChatCompletion must be implemented by provider');
	}

	/**
	 * Generate embeddings for text
	 * @param {Object} params - Parameters for embedding generation
	 * @param {string|Array} params.input - Text or array of texts to embed
	 * @param {string} params.model - Model identifier for embeddings
	 * @returns {Promise<Object>} - Standardized embedding response
	 */
	async generateEmbedding(params) {
		throw new Error('generateEmbedding must be implemented by provider');
	}

	/**
	 * Convert provider-specific response to standardized format
	 * @param {Object} response - Provider-specific response
	 * @returns {Object} - Standardized response
	 */
	normalizeResponse(response) {
		throw new Error('normalizeResponse must be implemented by provider');
	}

	/**
	 * Convert standardized parameters to provider-specific format
	 * @param {Object} params - Standardized parameters
	 * @returns {Object} - Provider-specific parameters
	 */
	convertParams(params) {
		throw new Error('convertParams must be implemented by provider');
	}

	/**
	 * Get available models for this provider
	 * @returns {Object} - Object with model types and their identifiers
	 */
	getAvailableModels() {
		return {
			chat: [],
			embedding: []
		};
	}

	/**
	 * Validate that required configuration is present
	 * @throws {Error} - If configuration is invalid
	 */
	validateConfig() {
		// Override in provider implementations
	}
}
