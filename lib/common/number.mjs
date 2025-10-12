export function isNumeric(str) {
	if (typeof str != 'string') return false;
	return !isNaN(str) && !isNaN(parseFloat(str));
}

export function isNumericOrNumber(str) {
	return typeof str === 'number' || isNumeric(str);
}

export const makeNumberNiceWithCommas = (val) => {
	if (!val) {
		return;
	}
	const formattedNumber = val?.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
	return formattedNumber;
};

export const numberWithCommas = (val) => {
	if (!val) {
		return;
	}
	const formattedNumber = val?.toLocaleString('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	});
	return formattedNumber;
};

export function getIncrease(oldPrice, newPrice) {
	if (!oldPrice || !newPrice) {
		return null;
	}
	oldPrice = Number(oldPrice);
	newPrice = Number(newPrice);
	const diff = (newPrice - oldPrice) / newPrice;
	return (100 * diff).toFixed(2) + '%';
}

export function clamp(min, val, max) {
	return Math.max(Math.min(val, max), min);
}

export const roundMoney = (val) => {
	if (typeof val === 'number') {
		const decimalPlaces = (val.toString().split('.')[1] || []).length;
		if (decimalPlaces <= 2) {
			return val;
		}
	}

	if (typeof val === 'string') {
		val = Number(val);
	}

	return Math.floor(val * 100) / 100;
};

export const roundMoneyFair = (val) => {
	if (val == null) return 0;

	if (typeof val === 'string') {
		val = Number(val);
	}
	if (val === 0) {
		return val;
	}
	return Math.round(val * 100) / 100;
};

export const roundMoneyTwoDigitsFairly = (amount) => {
	if (typeof amount === 'string') {
		amount = Number(amount);
	}
	return Math.round((amount + Number.EPSILON) * 100) / 100;
};

export function extractNumber(text) {
	if (!text) {
		return;
	}
	return Number(text?.match(/(\d+)/)?.[1]);
}

export function numberOrZero(numeric) {
	numeric = Number(numeric);
	return isNaN(numeric) ? 0 : numeric;
}

export const formatPercent = (value, decimalPlaces = 2) => {
	if (value == null) return '0%';
	return `${(value * 100).toFixed(decimalPlaces)}%`;
};
