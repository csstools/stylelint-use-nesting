import stylelint from 'stylelint';
import postcss from 'postcss';

export const ruleName = 'csstools/use-nesting';

export default stylelint.createPlugin(ruleName, (action, opts, context) => {
	const shouldFix = is(context, 'fix', true);

	return async (root, result) => {
		// validate the action
		const isActionValid = stylelint.utils.validateOptions(result, ruleName, {
			actual: action,
			possible() {
				return is(action, ['always', 'ignore', true, false, null]);
			}
		});

		if (isActionValid) {
			if (is(action, ['always', true])) {
				result.root.walkRules(rule => {
					const prev = rule.prev();

					// if the previous node is also a rule
					if (prev && prev.type === 'rule') {
						if (isNodeNesting(rule, prev)) {
							// fix or report the current rule if it could be nested inside the previous rule
							if (shouldFix) {
								fixNestedRule(rule, prev);
							} else {
								report(rule, prev, result);
							}
						} else if (isNodeNesting(prev, rule)) {
							// fix or report the previous rule if it could be nested inside the current rule
							if (shouldFix) {
								fixNestedRule(prev, rule);
							} else {
								report(prev, rule, result);
							}
						} else if (isNodeAtNesting(rule, prev)) {
							// fix or report the current rule if it could be nested inside the previous rule
							if (shouldFix) {
								fixNestedAtRule(rule, prev);
							} else {
								report(rule, prev, result);
							}
						} else if (isNodeAtNesting(prev, rule)) {
							// fix or report the previous rule if it could be nested inside the current rule
							if (shouldFix) {
								fixNestedAtRule(prev, rule);
							} else {
								report(prev, rule, result);
							}
						}
					}
				});
			}
		}
	};
});

export const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (node, prev) => `Expected "${node.selector}" inside "${prev.selector}".`
});

const is = (value, ...keys) => {
	const length = keys.length;
	const matches = keys.pop();
	const subvalue = keys.reduce((result, key) => Object(result)[key], value);

	return length ?
		[].concat(matches).some(
			match => match instanceof RegExp
				? match.test(subvalue)
			: match === subvalue
		)
	: Boolean(value);
};

const isNodeNesting = (rule1, rule2) =>
	rule2.selectors.every(
		rule2Selector => rule1.selectors.every(
			ruleSelector =>
				rule2Selector.length < ruleSelector.length &&
				rule2Selector === ruleSelector.slice(0, rule2Selector.length) &&
				!/^[A-z0-9-_]/.test(ruleSelector.slice(rule2Selector.length))
		)
	);

const isNodeAtNesting = (rule1, rule2) =>
	rule2.selectors.every(
		rule2Selector => rule1.selectors.every(
			rule1Selector =>
				rule2Selector.length < rule1Selector.length &&
				` ${rule2Selector}` === rule1Selector.slice(-rule2Selector.length - 1)
		)
	);

const fixNestedRule = (rule1, rule2) => {
	rule1.selectors = rule1.selectors.map(
		selector => `&${selector.slice(rule2.selector.length)}`
	);

	rule2.append(rule1);
};

const fixNestedAtRule = (rule1, rule2) => {
	rule1.remove();

	rule1.selectors = rule1.selectors.map(
		selector => `${selector.slice(0, -rule2.selector.length - 1)} &`
	);

	const atrule = Object.assign(
		postcss.atRule({
			name: 'nest',
			params: String(rule1.selector)
		}),
		{
			raws: Object.assign(rule1.raws, {
				afterName: ' '
			}),
			source: rule1.source
		}
	);

	atrule.append(...rule1.nodes);

	rule2.append(atrule);
};

const report = (rule1, rule2, result) => {
	stylelint.utils.report({
		message: messages.expected(rule1, rule2),
		node: rule1,
		result,
		ruleName
	});
};
