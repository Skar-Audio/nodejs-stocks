import {consoleLogRedWhite} from '../../../color-logging.mjs';

/**
 * Factory for creating AI provider instances
 * Supports dynamic provider switching via configuration
 */
class AIProviderFactory {
	constructor() {
		this.providers = new Map();
		this.defaultProvider = 'openai';
		this.currentProvider = null;
	}

	registerProvider(name, providerClass, config = {}) {
		try {
			const instance = new providerClass(config);
			instance.validateConfig();
			this.providers.set(name, instance);
		} catch (error) {
			consoleLogRedWhite(`Failed to register provider ${name}:`, error);
			throw error;
		}
	}

	getProvider(name) {
		if (!this.providers.has(name)) {
			throw new Error(
				`Provider '${name}' not registered. Available: ${Array.from(this.providers.keys()).join(', ')}`
			);
		}
		return this.providers.get(name);
	}

	getCurrentProvider() {
		const providerName = this.currentProvider || this.defaultProvider;
		return this.getProvider(providerName);
	}

	setCurrentProvider(name) {
		if (!this.providers.has(name)) {
			throw new Error(`Cannot set provider '${name}' - not registered`);
		}

		if (this.currentProvider && this.currentProvider !== name) {
			this.currentProvider = name;
			console.log(`🔄 Switching AI provider from ${this.currentProvider} to ${name}`);
		} else {
			this.currentProvider = name;
		}
	}

	setDefaultProvider(name) {
		if (!this.providers.has(name)) {
			throw new Error(`Cannot set default provider '${name}' - not registered`);
		}
		this.defaultProvider = name;
	}

	listProviders() {
		return Array.from(this.providers.keys());
	}

	async submitRequest(params) {
		const provider = this.getCurrentProvider();
		const fnName = params.fnName;
		console.log(
			`  🤖 Using AI (Provider: ${provider.providerName} | ${params?.model}) ${fnName ? `for ${fnName}` : ''}`
		);

		try {
			const cleanParams = {...params};
			delete cleanParams?.fnName;

			if (!cleanParams.messages && cleanParams.input) {
				cleanParams.messages = cleanParams.input;
			}

			const response = await provider.generateChatCompletion(cleanParams);
			return response;
		} catch (error) {
			consoleLogRedWhite(`[${provider.providerName}] Error:`, error);
			throw error;
		}
	}

	async submitEmbeddingRequest(params) {
		const provider = this.getCurrentProvider();

		try {
			const response = await provider.generateEmbedding(params);
			return response;
		} catch (error) {
			consoleLogRedWhite(`[${provider.providerName}] Embedding Error:`, error);
			throw error;
		}
	}
}

// Create singleton instance
export const aiProviderFactory = new AIProviderFactory();
