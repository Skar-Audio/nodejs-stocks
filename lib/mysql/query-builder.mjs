/**
 * Query builder utilities for MySQL
 */

export const getSelectQuery = (table, where = {}, options = {}) => {
	const {fields = '*', size, offset, orderBy, order = 'DESC'} = options;
	let query = `SELECT ${fields === '*' ? '*' : fields.join(', ')}
                 FROM ${table}`;
	const values = [];

	if (Object.keys(where).length > 0) {
		const conditions = Object.keys(where).map((key) => {
			values.push(where[key]);
			return `${key} = ?`;
		});
		query += ` WHERE ${conditions.join(' AND ')}`;
	}

	if (orderBy) {
		query += ` ORDER BY ${orderBy} ${order}`;
	}

	if (size) {
		query += ` LIMIT ?`;
		values.push(size);
	}

	if (offset) {
		query += ` OFFSET ?`;
		values.push(offset);
	}

	return {query, values};
};

export const getInsertQuery = (table, data) => {
	const keys = Object.keys(data);
	const values = Object.values(data);
	const placeholders = keys.map(() => '?').join(', ');

	const query = `INSERT INTO ${table} (${keys.join(', ')})
                   VALUES (${placeholders})`;
	return {query, values};
};

export const getInsertUpdateQuery = (table, data, updatePlus = {}, insertPlus = {}) => {
	const insertData = {...data, ...insertPlus};
	const updateData = {...data, ...updatePlus};

	const keys = Object.keys(insertData);
	const values = Object.values(insertData);
	const placeholders = keys.map(() => '?').join(', ');

	const updateKeys = Object.keys(updateData);
	const updateValues = Object.values(updateData);
	const updateSet = updateKeys.map((key) => `${key} = ?`).join(', ');

	const query = `INSERT INTO ${table} (${keys.join(', ')})
                   VALUES (${placeholders}) ON DUPLICATE KEY
                   UPDATE ${updateSet}`;

	return {query, values: [...values, ...updateValues]};
};

export const getUpdateQuery = (table, data, where) => {
	const keys = Object.keys(data);
	const values = Object.values(data);
	const setClause = keys.map((key) => `${key} = ?`).join(', ');

	const whereKeys = Object.keys(where);
	const whereValues = Object.values(where);
	const whereClause = whereKeys.map((key) => `${key} = ?`).join(' AND ');

	const query = `UPDATE ${table}
                   SET ${setClause}
                   WHERE ${whereClause}`;

	return {query, values: [...values, ...whereValues]};
};

export const getDeleteQuery = (table, where) => {
	const whereKeys = Object.keys(where);
	const whereValues = Object.values(where);
	const whereClause = whereKeys.map((key) => `${key} = ?`).join(' AND ');

	const query = `DELETE FROM ${table} WHERE ${whereClause}`;

	return {query, values: whereValues};
};
