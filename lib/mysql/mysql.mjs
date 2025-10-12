import {MysqlConnector} from './mysql-connector.mjs';
import invariant from 'tiny-invariant';

// Connection caches
let stocksDB;
let anyDB = {};

// Helper to validate and get environment variable
const getEnvVar = (varName, errorMessage) => {
	const value = process.env[varName];
	invariant(value, errorMessage || `${varName} is undefined`);
	return value;
};

// Helper to check if connection is valid
const isConnectionValid = (connection) => {
	if (!connection || !connection.connection) return false;
	try {
		const pool = connection.connection;
		return !(!pool || !pool?.pool || pool?.pool._closed);
	} catch (error) {
		console.error(`[DB Config] Error checking connection validity: ${error.message}`);
		return false;
	}
};

// Stocks DB connection - uses dedicated 'stocks' database
export function getStocksDB(dbName) {
	if (dbName) return getAnyCoreLinuxDB(dbName);
	if (isConnectionValid(stocksDB)) return stocksDB;

	stocksDB = new MysqlConnector({
		host: getEnvVar('MYSQL_HOST'),
		database: 'stocks', // Dedicated stocks database
		user: getEnvVar('MYSQL_USERNAME'),
		password: getEnvVar('MYSQL_PASSWORD'),
		port: parseInt(getEnvVar('MYSQL_PORT'), 10)
	});
	return stocksDB;
}

export function getAnyCoreLinuxDB(dbName = 'core_linux') {
	invariant(dbName, 'Database name is required');
	if (isConnectionValid(anyDB[dbName])) return anyDB[dbName];

	anyDB[dbName] = new MysqlConnector({
		host: getEnvVar('MYSQL_HOST'),
		database: dbName,
		user: getEnvVar('MYSQL_USERNAME'),
		password: getEnvVar('MYSQL_PASSWORD'),
		port: parseInt(getEnvVar('MYSQL_PORT'), 10)
	});
	return anyDB[dbName];
}

// Optional DB init checker
export const initDbs = async () => {
	const status = {
		isInitiatedCore: false
	};

	try {
		const coreDb = getAnyCoreLinuxDB('core_linux');
		await coreDb.query('SELECT 1');
		status.isInitiatedCore = true;
	} catch (error) {
		console.error('Failed to initialize Core Linux DB:', error.message);
	}

	return status;
};
