import stylelint from 'stylelint';
import is from './lib/is';
import areRulesPotentialNestingAtRule from './lib/are-rules-potential-nesting-at-rule';
import areRulesPotentialNestingRule from './lib/are-rules-potential-nesting-rule';
import fixNestingAtRule from './lib/fix-nesting-at-rule';
import fixNestingRule from './lib/fix-nesting-rule';

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
						if (areRulesPotentialNestingRule(rule, prev, opts)) {
							// fix or report the current rule if it could be nested inside the previous rule
							if (shouldFix) {
								fixNestingRule(rule, prev);
							} else {
								report(rule, prev, result);
							}
						} else if (areRulesPotentialNestingRule(prev, rule, opts)) {
							// fix or report the previous rule if it could be nested inside the current rule
							if (shouldFix) {
								fixNestingRule(prev, rule);
							} else {
								report(prev, rule, result);
							}
						} else if (areRulesPotentialNestingAtRule(rule, prev, opts)) {
							// fix or report the current rule if it could be nested inside the previous rule
							if (shouldFix) {
								fixNestingAtRule(rule, prev);
							} else {
								report(rule, prev, result);
							}
						} else if (areRulesPotentialNestingAtRule(prev, rule, opts)) {
							// fix or report the previous rule if it could be nested inside the current rule
							if (shouldFix) {
								fixNestingAtRule(prev, rule);
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

const report = (rule1, rule2, result) => {
	stylelint.utils.report({
		message: messages.expected(rule1, rule2),
		node: rule1,
		result,
		ruleName
	});
};
