import Anthropic from '@anthropic-ai/sdk';

let _anthropicClient = null;

export const getAnthropicClient = () => {
	if (!_anthropicClient) {
		const apiKey = process.env.ANTHROPIC_API_KEY;
		if (!apiKey) {
			throw new Error('ANTHROPIC_API_KEY environment variable is not set');
		}
		_anthropicClient = new Anthropic({
			apiKey: apiKey
		});
	}
	return _anthropicClient;
};

export const anthropicClient = new Proxy(
	{},
	{
		get(target, prop) {
			return getAnthropicClient()[prop];
		}
	}
);

export const anthropicModel = 'claude-3-5-sonnet-20241022';
export const anthropicModelHaiku = 'claude-3-5-haiku-20241022';
