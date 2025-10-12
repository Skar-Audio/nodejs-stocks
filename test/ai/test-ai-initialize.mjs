import {runTest} from '../bootstrap.mjs';
import {
	initializeProviders,
	listAIProviders,
	getCurrentAIProvider,
	switchAIProvider
} from '../../lib/ai/apis/ai-responses.mjs';

/**
 * Test AI provider initialization and setup without making API calls
 * This is a quick test to verify your AI configuration is working
 */

runTest(async () => {
	console.log('\n=== Testing AI Provider Initialization ===\n');

	// Test 1: Initialize providers
	console.log('Test 1: Initialize AI providers');
	initializeProviders();
	const availableProviders = listAIProviders();
	console.log('Available providers:', availableProviders);

	if (availableProviders.length === 0) {
		console.log('\n⚠️ No AI providers available.');
		console.log('Add API keys to your .env file:');
		console.log('   OPENAI_API_KEY=your_key_here');
		console.log('   GEMINI_API_KEY=your_key_here');
		console.log('   ANTHROPIC_API_KEY=your_key_here');
		return {
			success: false,
			message: 'No AI providers configured',
			availableProviders: []
		};
	}
	console.log('✓ AI providers initialized successfully');

	// Test 2: Get current provider
	console.log('\nTest 2: Get current AI provider');
	const currentProvider = getCurrentAIProvider();
	console.log('Current provider:', currentProvider);
	console.log('✓ Current provider retrieved');

	// Test 3: Test provider switching (if multiple available)
	if (availableProviders.length > 1) {
		console.log('\nTest 3: Test provider switching');
		const originalProvider = currentProvider;
		const secondProvider = availableProviders[1];

		// Switch to second provider
		switchAIProvider(secondProvider);
		const afterSwitch = getCurrentAIProvider();
		console.log(`Switched to: ${afterSwitch}`);
		const switchWorked = afterSwitch === secondProvider;
		console.log(switchWorked ? '✓ Provider switch successful' : '✗ Provider switch failed');

		// Switch back to original
		switchAIProvider(originalProvider);
		const afterSwitchBack = getCurrentAIProvider();
		console.log(`Switched back to: ${afterSwitchBack}`);
		const switchBackWorked = afterSwitchBack === originalProvider;
		console.log(
			switchBackWorked ? '✓ Provider switch back successful' : '✗ Provider switch back failed'
		);
	} else {
		console.log('\nTest 3: Skipped (only one provider available)');
	}

	// Test 4: Environment variable check
	console.log('\nTest 4: Check API key configuration');
	const apiKeys = {
		OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
		GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
		ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY
	};

	console.log('API Keys configured:');
	for (const [key, value] of Object.entries(apiKeys)) {
		console.log(`  ${key}: ${value ? '✓ Yes' : '✗ No'}`);
	}

	// Summary
	console.log('\n' + '='.repeat(50));
	console.log('SUMMARY');
	console.log('='.repeat(50));
	console.log(`Available providers: ${availableProviders.join(', ')}`);
	console.log(`Current provider: ${getCurrentAIProvider()}`);
	console.log(`Total providers configured: ${availableProviders.length}`);
	console.log('='.repeat(50));

	if (availableProviders.length > 0) {
		console.log(
			'\n✅ AI system is ready! You can now use AI features or run test-ai-chat-completion.mjs'
		);
	}

	return {
		success: true,
		availableProviders,
		currentProvider: getCurrentAIProvider(),
		apiKeysConfigured: apiKeys,
		message: 'AI initialization test completed'
	};
});
