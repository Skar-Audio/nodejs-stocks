import {
	getDeleteQuery,
	getInsertQuery,
	getInsertUpdateQuery,
	getSelectQuery,
	getUpdateQuery
} from './query-builder.mjs';
import invariant from 'tiny-invariant';

export class MysqlTable {
	constructor(db, table) {
		this.TABLE = table;
		this.db = db;
	}

	async select(where, options = {}) {
		const query = getSelectQuery(this.TABLE, where, options);
		return await this.db.query(query.query, query.values);
	}

	async selectQ(where, options = {}) {
		const query = getSelectQuery(this.TABLE, where, options);
		const start = new Date();
		const rows = await this.db.query(query.query, query.values);
		return {...query, rows, runtime: (new Date().getTime() - start.getTime()) / 1000};
	}

	async selectOne(where, options = {}) {
		const query = getSelectQuery(this.TABLE, where, {...options, size: 1});
		return (await this.db.query(query.query, query.values))[0];
	}

	async selectOneQ(where, options = {}) {
		const query = getSelectQuery(this.TABLE, where, {...options, size: 1});
		const row = (await this.db.query(query.query, query.values))[0];
		return {query: query.query, values: query.values, row};
	}

	async insertUpdate(data, updatePlus = {}, insertPlus = {}) {
		try {
			const query = getInsertUpdateQuery(this.TABLE, data, updatePlus, insertPlus);
			const res = await this.db.query(query.query, query.values);
			return {...res, query: query.query, values: query.values};
		} catch (error) {
			console.error('Error in insertUpdate:', error);
			throw error;
		}
	}

	async insert(data) {
		try {
			const query = getInsertQuery(this.TABLE, data);
			const res = await this.db.query(query.query, query.values);
			return {...res, query: query.query, values: query.values};
		} catch (error) {
			console.error('Error in insert:', error);
			throw error;
		}
	}

	async update(data, where) {
		try {
			invariant(where, 'where missing in update query');
			const query = getUpdateQuery(this.TABLE, data, where);
			const res = await this.db.query(query.query, query.values);
			return {...res, query: query.query, values: query.values};
		} catch (error) {
			console.error('Error in update:', error);
			throw error;
		}
	}

	async deleteOne(where) {
		invariant(where, 'unable to delete everything');
		const query = getDeleteQuery(this.TABLE, where);
		const res = await this.db.query(query.query, query.values);
		return {...res, query: query.query, values: query.values};
	}
}
