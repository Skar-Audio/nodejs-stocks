import mysql from 'mysql2/promise.js';
import {MysqlTable} from './mysql-table.mjs';
import {
	consoleLogLighterGreenBlue,
	consoleLogLightYellowOrange,
	consoleLogRedWhite
} from '../color-logging.mjs';

const pools = {};

export class MysqlConnector {
	config;
	connection;
	databaseName;
	alive = true;
	closed = false;
	tableName;

	constructor(config) {
		this.config = {
			...config,
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 0,
			enableKeepAlive: true,
			keepAliveInitialDelay: 0
		};
		this.databaseName = config.database;
		this.connection = mysql.createPool(this.config);
		pools[this.databaseName] = this.connection;

		this.connection.on('error', (err) => {
			consoleLogRedWhite(
				`[MYSQL][Error] Error event triggered in database [${this.databaseName}]. Connection is dead: `,
				err
			);
			this.alive = false;
		});
	}

	getTable(tableName) {
		this.tableName = tableName;
		return new MysqlTable(this, tableName);
	}

	query = async (sql, args) => {
		let attempt = 0;
		const maxRetries = 3;
		const retryDelay = 250;
		const retryableErrors = [
			'ECONNRESET',
			'PROTOCOL_CONNECTION_LOST',
			'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR',
			'ER_LOCK_DEADLOCK',
			'Pool is closed'
		];

		while (attempt < maxRetries) {
			try {
				if (attempt > 0) {
					console.log(
						`[${new Date().toISOString()}] [MYSQL QUERY START] Attempt ${attempt + 1} running...`
					);
				}
				const [rows] = await this.connection.query(sql, args);
				return rows;
			} catch (error) {
				const now = new Date().toISOString();

				if (!error?.message?.toLowerCase()?.includes('duplicate')) {
					consoleLogRedWhite(
						`[${now}] [MYSQL ERROR] [DB: ${this.databaseName || 'unknown'} | Table: ${this.tableName || 'unknown'} (attempt ${attempt + 1})] Code: ${error?.code || 'N/A'} | SQL: ${sql}`,
						error
					);
				}

				const isRetryableError = retryableErrors?.includes(error?.code);
				if (isRetryableError) {
					attempt++;
					if (attempt === 1) {
						consoleLogRedWhite(
							`[${now}] [MYSQL POOL RESET] Deleting the existing connection pool for database "${this.databaseName || 'unknown'}" due to connection loss.`
						);
						delete pools[this.databaseName];
						this.connection = mysql.createPool(this.config);
						pools[this.databaseName] = this.connection;
					}

					if (attempt < maxRetries) {
						console.warn(
							`[${now}] [MYSQL RETRY] Retrying query (Attempt ${attempt + 1}/${maxRetries}) after error: ${error?.message}`
						);
						await new Promise((resolve) => setTimeout(resolve, retryDelay));
						continue;
					}
				}
				throw error;
			}
		}
	};

	async getTableFields(tableName) {
		try {
			return await this.query('DESCRIBE ' + tableName);
		} catch (e) {
			console.log('getTableFields', this.config);
		}
	}

	async transaction(callback) {
		let connection;
		try {
			connection = await this.connection.getConnection();
			await connection.beginTransaction();

			const result = await callback(connection);

			await connection.commit();
			return result;
		} catch (error) {
			if (connection) {
				try {
					await connection.rollback();
				} catch (rollbackError) {
					console.error('[MySQL] Error during transaction rollback:', rollbackError);
				}
			}
			throw error;
		} finally {
			if (connection) {
				connection.release();
			}
		}
	}

	async close() {
		this.alive = false;
		this.closed = true;
		await this.connection.end();
	}

	async runInsideTransaction(someCode) {
		await this.query('START TRANSACTION');
		consoleLogLightYellowOrange('[MYSQL]', ' => TRANSACTION STARTED');
		try {
			const res = await someCode();
			await this.query('COMMIT');
			consoleLogLighterGreenBlue('[MYSQL]', ' => TRANSACTION COMMITTED');
			return res;
		} catch (e) {
			consoleLogRedWhite('[Error][runInsideTransaction][MYSQL]', ' => TRANSACTION ROLLBACK');
			await this.query('ROLLBACK');
			throw e;
		}
	}
}

export const repeatDatabaseTransactionUntilSuccess = async (db, someCode, maxRepeat = 4) => {
	for (let repeatIndex = 0; repeatIndex < maxRepeat; repeatIndex++) {
		try {
			console.time('runInsideTransaction');
			const result = await db.runInsideTransaction(async () => {
				return await someCode(repeatIndex);
			});
			console.timeEnd('runInsideTransaction');
			return result;
		} catch (e) {
			consoleLogRedWhite('[Error][repeatDatabaseTransactionUntilSuccess][MYSQL]', e);
		}
	}
	throw new Error(`Failed transaction permanently after ${maxRepeat} attempts`);
};
