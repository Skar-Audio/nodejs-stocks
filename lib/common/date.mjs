import {DateTime} from 'luxon';
import {capitalizeFirstLetter} from './string.mjs';

export const getTodaysDateAsTenCharISO = () => {
	return getNowForSQL().substring(0, 10);
};

export const getDateForDaysAgoAsISODate = (daysAgo = 30, options = {}) => {
	const startDate = options?.startDate ?? DateTime.now().minus({days: daysAgo}).toISODate();
	return startDate;
};

export const getTodaysDate = () => {
	return new Date().toLocaleDateString('en-US', {
		calendar: 'gregory'
	});
};

export const getNumberOfDaysAgoForDate = (inputDate) => {
	const date = new Date(inputDate + 'T00:00:00');
	const currentDate = new Date();
	currentDate.setHours(0, 0, 0, 0);
	const differenceInMs = currentDate.getTime() - date.getTime();
	const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
	return differenceInDays;
};

export const getDateForNumberOfDaysAgo = (numberOfDaysAgo) => {
	const date = new Date();
	date.setDate(date.getDate() - numberOfDaysAgo);
	return date;
};

export const getNowForSQL = () => {
	return DateTime.now()
		.setZone('America/New_York')
		.toSQL({includeOffset: false, includeZone: false});
};

export const sleep = (seconds) => {
	return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

export const sleepMs = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export const formatTimestamp = (ts) => {
	if (typeof ts === 'string') {
		if (ts.endsWith('Z')) {
			ts = DateTime.fromISO(ts).minus({hours: 0}).toISO();
		}
	}
	return niceRelativeDateTimeInNY(ts);
};

export const humanDate = (date) => {
	if (!date) {
		return null;
	}
	if (typeof date === 'string') {
		date = new Date(date);
	}
	try {
		return date?.toISOString()?.substring(0, 10);
	} catch (e) {
		console.error(e);
		return '???';
	}
};

export const niceDateTime = (iso) => {
	let date = typeof iso === 'string' ? DateTime.fromISO(iso) : DateTime.fromJSDate(iso);
	date = date
		.toISO({suppressMilliseconds: true, suppressSeconds: true, includeOffset: false})
		?.replace('T', ' ');
	if (date) {
		const indexOfPeriod = date.indexOf('.');
		if (indexOfPeriod !== -1) {
			date = date.slice(0, indexOfPeriod);
		}
	}
	return date;
};

export const niceDateTimeInNY = (iso) => {
	const date = typeof iso === 'string' ? DateTime.fromISO(iso) : DateTime.fromJSDate(iso);
	return date
		.setZone('America/New_York')
		.toISO({suppressMilliseconds: true, suppressSeconds: true, includeOffset: false})
		?.replace('T', ' ')
		.substring(0, 16);
};

export const niceRelativeDateTimeInNY = (iso) => {
	if (!iso) {
		return iso;
	}
	let isoTill19 = iso?.substring(0, 19);
	let date =
		typeof iso === 'string'
			? DateTime.fromISO(isoTill19, {zone: 'America/New_York'})
			: DateTime.fromJSDate(iso, {zone: 'America/New_York'});

	const d = resetTime(new Date(date || Date.now()));
	const now = resetTime(new Date());
	let dateTime = DateTime.fromMillis(d.getTime());
	dateTime = dateTime.setZone('America/New_York');

	const max_days_written_off = 7;
	const diff = dateTime.diff(DateTime.fromMillis(now.getTime()), 'days');
	if (diff.days >= -max_days_written_off && diff.days <= max_days_written_off) {
		const base = DateTime.fromMillis(1642201200000);
		let relative = base.plus({days: diff.days}).toRelativeCalendar({base});
		const time = date.toLocaleString({hour: 'numeric', minute: '2-digit'});

		if (diff.days < -1) {
			relative = base.plus({days: diff.days}).toLocaleString({weekday: 'long'});
		}

		return `${capitalizeFirstLetter(relative)} at ${time}`;
	}

	if (DateTime.now().hasSame(date, 'year')) {
		return date.toLocaleString({
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	} else {
		return date.toLocaleString({
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}
};

export const formatDate = (str) => {
	return new Date(str).toLocaleDateString('en-US', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
};

export const formatDateTime = (str) => {
	return new Date(str).toLocaleDateString('en-US', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
		timeZone: 'America/New_York'
	});
};

export const resetTime = (date) => {
	const dt = DateTime.fromJSDate(date, {zone: 'America/New_York'});
	return dt.startOf('day').toJSDate();
};

export const ageInDaysSince = (time) => {
	let dt = time instanceof Date ? DateTime.fromJSDate(time) : DateTime.fromISO(time);
	dt = dt.diffNow().as('days');
	dt = Math.abs(dt);
	return dt;
};
