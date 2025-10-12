import {runTest, loadEnv} from './bootstrap.mjs';

/**
 * This test verifies that the bootstrap setup is working correctly
 * Run this first to ensure your test environment is properly configured
 */

runTest(async () => {
	console.log('\n=== Bootstrap Verification Test ===\n');

	// Test 1: Environment variables loaded
	console.log('Test 1: Verify environment variables are loaded');
	const requiredEnvVars = ['MYSQL_HOST', 'MYSQL_DATABASE', 'MYSQL_USERNAME', 'MYSQL_PASSWORD'];
	let allEnvVarsLoaded = true;

	for (const envVar of requiredEnvVars) {
		const isLoaded = !!process.env[envVar];
		console.log(`  ${envVar}: ${isLoaded ? '✓ loaded' : '✗ missing'}`);
		if (!isLoaded) allEnvVarsLoaded = false;
	}

	if (allEnvVarsLoaded) {
		console.log('\n✓ All required environment variables are loaded');
	} else {
		console.log('\n✗ Some environment variables are missing');
		console.log('Make sure your .env file exists and contains the required variables');
	}

	// Test 2: Node version check
	console.log('\nTest 2: Node.js version check');
	const nodeVersion = process.version;
	console.log(`  Node.js version: ${nodeVersion}`);
	const majorVersion = parseInt(nodeVersion.split('.')[0].slice(1));
	if (majorVersion >= 22) {
		console.log('  ✓ Node.js version is compatible (>= 22.0.0)');
	} else {
		console.log('  ✗ Node.js version should be >= 22.0.0');
	}

	// Test 3: Module type
	console.log('\nTest 3: Module system check');
	console.log('  Module type: ES Module (using .mjs)');
	console.log('  ✓ ES Module imports are working');

	// Test 4: runTest helper
	console.log('\nTest 4: runTest helper verification');
	console.log('  ✓ runTest helper is functioning correctly');

	// Summary
	console.log('\n' + '='.repeat(50));
	console.log('SUMMARY');
	console.log('='.repeat(50));
	console.log(`Environment variables: ${allEnvVarsLoaded ? '✓ OK' : '✗ FAIL'}`);
	console.log(`Node.js version: ${majorVersion >= 22 ? '✓ OK' : '✗ FAIL'}`);
	console.log(`Module system: ✓ OK`);
	console.log(`runTest helper: ✓ OK`);
	console.log('='.repeat(50));

	if (allEnvVarsLoaded && majorVersion >= 22) {
		console.log('\n🎉 Bootstrap is configured correctly! You can now run other tests.');
	} else {
		console.log('\n⚠️  Please fix the issues above before running other tests.');
	}

	return {
		success: allEnvVarsLoaded && majorVersion >= 22,
		nodeVersion,
		envVarsLoaded: allEnvVarsLoaded
	};
});
