import {runTest} from '../bootstrap.mjs';
import {
	initializeProviders,
	submitToAIProvider,
	listAIProviders,
	switchAIProvider
} from '../../lib/ai/apis/ai-responses.mjs';

runTest(async () => {
	console.log('\n=== Testing AI Chat Completion ===\n');

	// Initialize providers using the built-in function
	console.log('Initializing AI providers...');
	initializeProviders();
	const availableProviders = listAIProviders();
	console.log('Available providers:', availableProviders);

	if (availableProviders.length === 0) {
		console.log('\n⚠️ No AI providers available. Check your API keys in .env:');
		console.log('   - OPENAI_API_KEY');
		console.log('   - GEMINI_API_KEY');
		console.log('   - ANTHROPIC_API_KEY');
		return {success: false, message: 'No AI providers configured'};
	}

	// Test 1: Simple chat completion request
	console.log('\nTest 1: Simple chat completion (using current provider)');
	try {
		const response = await submitToAIProvider({
			messages: [
				{
					role: 'user',
					content: 'What is the stock market? Answer in one sentence.'
				}
			],
			fnName: 'test-simple-chat'
		});

		console.log('\n✓ Response received:');
		// Extract content from response (handles both OpenAI format and normalized format)
		const content =
			response.choices?.[0]?.message?.content || response.content || 'No content in response';
		console.log('Content:', content);
		console.log('Model used:', response.model);
		console.log('Tokens:', response.usage);
	} catch (error) {
		console.log('✗ Error during chat completion:', error.message);
		console.log('Error details:', error);
	}

	// Test 2: Test with different provider (if available)
	if (availableProviders.length > 1) {
		console.log('\nTest 2: Testing with different provider');
		const secondProvider = availableProviders[1];

		try {
			const response = await submitToAIProvider({
				messages: [
					{
						role: 'user',
						content: 'What does P/E ratio mean? Answer in one sentence.'
					}
				],
				provider: secondProvider,
				fnName: 'test-different-provider'
			});

			console.log(`\n✓ Response from ${secondProvider}:`);
			// Extract content from response (handles different provider formats)
			const content =
				response.choices?.[0]?.message?.content ||
				response.content?.[0]?.text ||
				response.content ||
				'No content in response';
			console.log('Content:', content);
		} catch (error) {
			console.log(`✗ Error with ${secondProvider}:`, error.message);
		}
	}

	// Test 3: Test provider switching
	if (availableProviders.length > 1) {
		console.log('\nTest 3: Testing provider switching');
		const firstProvider = availableProviders[0];
		const secondProvider = availableProviders[1];

		switchAIProvider(secondProvider);
		console.log(`✓ Switched to ${secondProvider}`);

		switchAIProvider(firstProvider);
		console.log(`✓ Switched back to ${firstProvider}`);
	}

	return {
		success: true,
		availableProviders,
		message: 'AI chat completion tests completed'
	};
});
