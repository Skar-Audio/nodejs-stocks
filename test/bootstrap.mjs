import dotenv from 'dotenv';
import {consoleLogRedWhite} from '../lib/color-logging.mjs';
import {fileURLToPath} from 'url';
import {dirname, resolve, join} from 'path';
import {existsSync} from 'fs';

// Get the directory of this bootstrap file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to find .env file by searching up the directory tree
function findEnvFile(startDir) {
	let currentDir = startDir;
	const root = resolve('/');

	while (currentDir !== root) {
		const envPath = join(currentDir, '.env');
		if (existsSync(envPath)) {
			return envPath;
		}
		currentDir = resolve(currentDir, '..');
	}

	// Also check root
	const envPath = join(root, '.env');
	if (existsSync(envPath)) {
		return envPath;
	}

	return null;
}

export async function loadEnv() {
	// Try to find .env file starting from project root (one level up from test directory)
	const projectRoot = resolve(__dirname, '..');
	let envPath = join(projectRoot, '.env');

	// If not found in expected location, search upwards
	if (!existsSync(envPath)) {
		envPath = findEnvFile(process.cwd());
		if (!envPath) {
			envPath = findEnvFile(__dirname);
		}
	}

	if (!envPath) {
		throw new Error(
			'.env file not found. Please create a .env file in your project root: ' + projectRoot
		);
	}

	dotenv.config({path: envPath});
	console.log(`✓ Loaded environment from: ${envPath}`);

	if (!process.env.MYSQL_HOST) {
		throw new Error(
			'.env file found but MYSQL_HOST is not set. Make sure your .env file contains required variables.'
		);
	}
}

export function consoleDir(obj, options = {}) {
	console.dir(obj, {depth: null, colors: true, ...options});
}

export async function runTest(code) {
	await loadEnv();

	console.log('runTest', process.uptime());
	let output;
	try {
		output = await code();
	} catch (e) {
		if (e?.response?.data?.errors?.length) {
			consoleLogRedWhite(
				'[Error][runTest] Errors from Response Data Errors:',
				e?.response?.data?.errors
			);
		} else if (e?.message) {
			consoleLogRedWhite('[Error][runTest] Message:', e?.message);
			consoleLogRedWhite('[Error][runTest] Stack:', e?.stack);
		} else {
			consoleLogRedWhite('[Error][runTest]', e);
		}
	}
	if (output) {
		console.dir('runTest output:');
		consoleDir(output);
	}
	console.log('Done in', process.uptime());
	process.exit(0);
}
