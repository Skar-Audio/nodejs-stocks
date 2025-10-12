/**
 * Color logging utilities
 */

export const consoleLogRedWhite = (...args) => {
	console.log('\x1b[41m\x1b[37m%s\x1b[0m', ...args);
};

export const consoleLogLighterGreenBlue = (...args) => {
	console.log('\x1b[46m\x1b[30m%s\x1b[0m', ...args);
};

export const consoleLogLightYellowOrange = (...args) => {
	console.log('\x1b[43m\x1b[30m%s\x1b[0m', ...args);
};
