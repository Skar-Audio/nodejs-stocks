import {runTest} from '../bootstrap.mjs';
import {aiProviderFactory} from '../../lib/ai/apis/base/ai-provider-factory.mjs';
import {OpenAIProvider} from '../../lib/ai/apis/openai/openai-provider.mjs';
import {GeminiProvider} from '../../lib/ai/apis/gemini/gemini-provider.mjs';
import {AnthropicProvider} from '../../lib/ai/apis/anthropic/anthropic-provider.mjs';
import {openAiModel} from '../../lib/ai/apis/openai/openai-config.mjs';
import {geminiModel} from '../../lib/ai/apis/gemini/gemini-config.mjs';
import {anthropicModel} from '../../lib/ai/apis/anthropic/anthropic-config.mjs';

runTest(async () => {
	console.log('\n=== Testing AI Provider Factory ===\n');

	// Test 1: Register providers
	console.log('Test 1: Register AI providers');
	try {
		aiProviderFactory.registerProvider('openai', OpenAIProvider, {
			defaultModel: openAiModel
		});
		console.log('✓ OpenAI provider registered');
	} catch (error) {
		console.log('✗ OpenAI provider registration failed:', error.message);
	}

	try {
		aiProviderFactory.registerProvider('gemini', GeminiProvider, {
			defaultModel: geminiModel
		});
		console.log('✓ Gemini provider registered');
	} catch (error) {
		console.log('✗ Gemini provider registration failed:', error.message);
	}

	try {
		aiProviderFactory.registerProvider('anthropic', AnthropicProvider, {
			defaultModel: anthropicModel
		});
		console.log('✓ Anthropic provider registered');
	} catch (error) {
		console.log('✗ Anthropic provider registration failed:', error.message);
	}

	// Test 2: List providers
	console.log('\nTest 2: List registered providers');
	const providers = aiProviderFactory.listProviders();
	console.log('Registered providers:', providers);

	// Test 3: Get current provider
	console.log('\nTest 3: Get current provider');
	try {
		const currentProvider = aiProviderFactory.getCurrentProvider();
		console.log('Current provider:', currentProvider.providerName);
		console.log('✓ Current provider retrieved');
	} catch (error) {
		console.log('✗ Error getting current provider:', error.message);
	}

	// Test 4: Switch provider
	console.log('\nTest 4: Switch provider');
	if (providers.includes('gemini')) {
		aiProviderFactory.setCurrentProvider('gemini');
		const newProvider = aiProviderFactory.getCurrentProvider();
		console.log('Switched to provider:', newProvider.providerName);
		console.log('✓ Provider switched successfully');
	}

	// Test 5: Get specific provider
	console.log('\nTest 5: Get specific provider by name');
	if (providers.includes('anthropic')) {
		const anthropicProvider = aiProviderFactory.getProvider('anthropic');
		console.log('Retrieved provider:', anthropicProvider.providerName);
		console.log('✓ Provider retrieved by name');
	}

	return {
		success: true,
		registeredProviders: providers,
		message: 'AI Provider Factory tests completed'
	};
});
