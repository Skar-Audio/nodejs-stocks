export const arraySum = (items, selector) => {
	return items?.reduce((a, x) => a + selector(x), 0);
};

export const arraySort = (items, selector) => {
	if (!items?.length) return items;
	items = items?.sort(sortBy(selector));
	return items;
};

export const arraySortBToA = (items, selector) => {
	items = items.sort(sortBy(selector));
	items = items.reverse();
	return items;
};

export const sortBy = (selector) => {
	return (a, b) => {
		a = selector(a);
		b = selector(b);
		if (typeof a === 'number' && typeof b === 'number') {
			return a - b;
		}
		if (a instanceof Date && b instanceof Date) {
			return a.getTime() - b.getTime();
		}
		a = String(a);
		b = String(b);
		return a.localeCompare(b);
	};
};

export function arrayWithout(array, selector) {
	return array?.filter((x) => !selector(x));
}

export function arrayUnique(array, selector) {
	if (!selector) {
		throw new Error('Must provide Selector. Fix Provided Params of arrayUnique');
	}
	const uniqSet = [...new Set(array.map(selector))];
	return uniqSet.map((uniqItem) => {
		return array.find((x) => selector(x) === uniqItem);
	});
}

export function arrayGroupBySelector(arr, selector, groupByKey = 'groupKey') {
	let uniqValues = [...new Set(arr?.map(selector))];
	return uniqValues.map((oneValue) => {
		let items = arr?.filter((x) => selector(x) === oneValue);
		items = remapRowsAddIndex(items);
		return {
			[groupByKey]: oneValue,
			items
		};
	});
}

export const remapRowsAddIndex = (rows) => {
	if (!rows?.length) {
		return null;
	}
	return rows?.map((row, index) => ({
		index: index + 1,
		...row
	}));
};

export const deepObjectEqual = (obj1, obj2, keyFields = null) => {
	if (obj1 === obj2) return true;
	if (!obj1 || !obj2) return false;
	if (isPrimitive(obj1) || isPrimitive(obj2)) return obj1 === obj2;

	if (Array.isArray(obj1) && Array.isArray(obj2)) {
		return deepArrayEqual(obj1, obj2, keyFields);
	}

	if (obj1 instanceof Date && obj2 instanceof Date) {
		return obj1.getTime() === obj2.getTime();
	}

	const keys = keyFields || Object.keys(obj1);

	if (!keyFields) {
		const keys2 = Object.keys(obj2);
		if (keys.length !== keys2.length) return false;
	}

	for (let key of keys) {
		const val1 = obj1[key];
		const val2 = obj2[key];

		if (val1 === undefined && val2 === undefined) continue;

		if (val1 === null && val2 === null) continue;
		if (val1 === null || val2 === null) return false;

		if (isPrimitive(val1) && isPrimitive(val2)) {
			if (val1 !== val2) return false;
			continue;
		}

		if (typeof val1 === 'object' && typeof val2 === 'object') {
			if (!deepObjectEqual(val1, val2)) return false;
			continue;
		}

		if (typeof val1 !== typeof val2) return false;

		if (typeof val1 === 'function') {
			if (val1 !== val2) return false;
			continue;
		}

		if (val1 !== val2) return false;
	}

	return true;
};

const deepArrayEqual = (arr1, arr2, keyFields = null) => {
	if (arr1 === arr2) return true;
	if (!arr1 || !arr2) return false;
	if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
	if (arr1.length !== arr2.length) return false;

	if (arr1.length === 0) return true;

	for (let i = 0; i < arr1.length; i++) {
		const item1 = arr1[i];
		const item2 = arr2[i];

		if (isPrimitive(item1) && isPrimitive(item2)) {
			if (item1 !== item2) return false;
			continue;
		}

		if (isPrimitive(item1) !== isPrimitive(item2)) {
			return false;
		}

		if (!deepObjectEqual(item1, item2, keyFields)) {
			return false;
		}
	}

	return true;
};

const isPrimitive = (val) => {
	return val == null || typeof val !== 'object';
};
