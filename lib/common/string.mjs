export function removeLineBreaks(str) {
	if (!str) {
		return;
	}
	str = str?.replaceAll(/\n\t/g, '');
	str = str?.replaceAll(/\s+/g, ' ');
	return str;
}

export function removeDots(str) {
	return str?.replace(/\./g, '');
}

export function capitalizeEveryWord(string) {
	return string
		.split(/\s|_/)
		.map((x) => x?.[0]?.toUpperCase() + x?.slice(1))
		.join(' ');
}

export function capitalizeTheFirstLetterOfEachWord(words) {
	let separateWord = words.toLowerCase().split(' ');
	for (let i = 0; i < separateWord.length; i++) {
		separateWord[i] = separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
	}
	return separateWord.join(' ');
}

export function capitalizeFirstLetter(text) {
	if (!text) {
		return text;
	}
	const temp = text
		?.split(' ')
		?.filter((x) => x !== '.')
		?.map((word) =>
			word.length > 0 ? word?.[0].toUpperCase() + word?.substring(1)?.toLowerCase() : word
		)
		?.join(' ')
		?.trim();

	return temp?.replace(/\./g, ' ');
}

export function pathJoin(...parts) {
	const isAbs = parts[0].startsWith('/');
	const allParts = parts
		.map((x) => (x?.endsWith('/') ? x?.substring(0, -1) : x))
		.map((x) => (x?.startsWith('/') ? x?.substring(1) : x));
	return (isAbs ? '/' : '') + allParts.join('/');
}

export function includesAnyOf(str, includeList = []) {
	return includeList.some((x) => str.includes(x));
}

export function capitalizeString(str) {
	if (!str) return str;
	return str
		?.replaceAll('_', ' ')
		?.split(' ')
		?.map((e) => capitalizeFirstLetter(e))
		?.join(' ');
}

export function adjustFirstLastName(val) {
	if (!val) return null;
	const valNoWhitespaces = val.trim();
	const valNoDots = removeDots(valNoWhitespaces);
	return capitalizeFirstLetter(valNoDots);
}

export function escapeRegExpStrict(text) {
	text = text?.replace(/[-{}*+?.,^$#\s]/g, '\\$&');
	return text;
}

export function slugify(string) {
	return string
		.toString()
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^\w-]+/g, '')
		.replace(/--+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '');
}
