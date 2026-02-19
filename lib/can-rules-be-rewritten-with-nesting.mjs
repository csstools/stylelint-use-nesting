/* eslint-disable no-labels */
import parser from 'postcss-selector-parser';

const serializationCache = new WeakMap();

function serialize(node) {
	const cached = serializationCache.get(node);
	if (cached) return cached;

	let str = node.toString().trim();
	if (!str) {
		str = ' ';
	}

	serializationCache.set(node, str);

	return str;
}

export default function canRulesBeRewrittenWithNesting(rule1, rule2, opts) {
	let sharedPrefix = '';
	let sharedSuffix = '';
	let containsNestingSelector = false;
	let containsPseudoElementSelector = false;

	const a = parser().astSync(rule1.selector);
	const b = parser().astSync(rule2.selector);

	a.walk((x) => {
		if (parser.isNesting(x)) {
			containsNestingSelector = true;
			return false;
		}

		if (parser.isPseudoElement(x)) {
			containsPseudoElementSelector = true;
			return false;
		}
	});

	b.walk((x) => {
		if (parser.isNesting(x)) {
			containsNestingSelector = true;
			return false;
		}

		if (parser.isPseudoElement(x)) {
			containsPseudoElementSelector = true;
			return false;
		}
	});

	if (containsNestingSelector || containsPseudoElementSelector) {
		return false;
	}

	const selectors = [
		...a.nodes,
		...b.nodes
	];

	for (const selector of selectors) {
		if (parser.isCombinator(selector.nodes[0])) {
			return false;
		}
	}

	const maxLength = Math.max(...selectors.map((x) => x.nodes?.length));

	LEFT_TO_RIGHT_OUTER:
	for (let i = 0; i < maxLength; i++) {
		const currentNode = selectors[0].nodes[i];
		if (!currentNode) break LEFT_TO_RIGHT_OUTER;

		const current = serialize(currentNode);

		for (let j = 1; j < selectors.length; j++) {
			const compareNode = selectors[j].nodes[i];
			if (!compareNode) break LEFT_TO_RIGHT_OUTER;

			const compare = serialize(compareNode);
			if (compare !== current) break LEFT_TO_RIGHT_OUTER;
		}

		sharedPrefix += current;
	}

	RIGHT_TO_LEFT_OUTER:
	for (let i = 0; i < maxLength; i++) {
		const ii = selectors[0].nodes.length - (1 + i);

		const currentNode = selectors[0].nodes[ii];
		if (!currentNode) break RIGHT_TO_LEFT_OUTER;

		const current = serialize(currentNode);

		for (let j = 1; j < selectors.length; j++) {
			const ij = selectors[j].nodes.length - (1 + i);

			const compareNode = selectors[j].nodes[ij];
			if (!compareNode) break RIGHT_TO_LEFT_OUTER;

			const compare = serialize(compareNode);
			if (compare !== current) break RIGHT_TO_LEFT_OUTER;
		}

		sharedSuffix += current;
	}

	if (!sharedPrefix && !sharedSuffix) {
		return false;
	}

	return true;
}
