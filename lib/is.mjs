export default function is(value, ...keys) {
	const length = keys.length;
	const matches = keys.pop();
	const subvalue = keys.reduce((result, key) => Object(result)[key], value);

	return length
		? [].concat(matches).some(
			match => match instanceof RegExp
				? match.test(subvalue)
			: match === subvalue
		)
	: Boolean(value);
}
