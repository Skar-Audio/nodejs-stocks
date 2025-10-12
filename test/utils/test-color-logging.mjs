import {runTest} from '../bootstrap.mjs';
import {
	consoleLogRedWhite,
	consoleLogLighterGreenBlue,
	consoleLogLightYellowOrange
} from '../../lib/color-logging.mjs';

runTest(async () => {
	console.log('\n=== Testing Color Logging Utilities ===\n');

	console.log('Test 1: Red/White logging (typically for errors)');
	consoleLogRedWhite('This is a red background with white text message');

	console.log('\nTest 2: Light Green/Blue logging (typically for info)');
	consoleLogLighterGreenBlue('This is a lighter green/blue background message');

	console.log('\nTest 3: Light Yellow/Orange logging (typically for warnings)');
	consoleLogLightYellowOrange('This is a light yellow/orange background message');

	console.log('\nTest 4: Multiple arguments');
	consoleLogRedWhite('Error:', {code: 500, message: 'Test error'});

	return {
		success: true,
		message: 'All color logging tests completed (check output above for colors)'
	};
});
