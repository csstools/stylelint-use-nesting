export default {
	input: 'src/index.js',
	output: [
		{ file: 'index.cjs', format: 'cjs', sourcemap: true },
		{ file: 'index.mjs', format: 'es', sourcemap: true }
	]
};
