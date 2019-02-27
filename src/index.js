import stylelint from 'stylelint';
import is from './lib/is';
import areRulesPotentialNestingAtRule from './lib/are-rules-potential-nesting-at-rule';
import areRulesPotentialNestingMediaRule from './lib/are-rules-potential-nesting-media-rule';
import areRulesPotentialNestingRule from './lib/are-rules-potential-nesting-rule';
import fixNestingAtRule from './lib/fix-nesting-at-rule';
import fixNestingMediaRule from './lib/fix-nesting-media-rule';
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
				result.root.walk(rule => {
					let isProcessing = true;

					while (isProcessing) {
						isProcessing = false;

						const prev = rule.prev();

						const isRuleValid = rule && (rule.type === 'rule' || rule.type === 'atrule');
						const isPrevValid = prev && (prev.type === 'rule' || prev.type === 'atrule');

						// if the previous node is also a rule
						if (isRuleValid && isPrevValid) {
							if (areRulesPotentialNestingRule(rule, prev, opts)) {
								// fix or report the current rule if it could be nested inside the previous rule
								if (shouldFix) {
									fixNestingRule(rule, prev);

									isProcessing = true;
								} else {
									report(rule, prev, result);
								}
							} else if (areRulesPotentialNestingRule(prev, rule, opts)) {
								// fix or report the previous rule if it could be nested inside the current rule
								if (shouldFix) {
									fixNestingRule(prev, rule);

									isProcessing = true;
								} else {
									report(prev, rule, result);
								}
							} else if (areRulesPotentialNestingAtRule(rule, prev, opts)) {
								// fix or report the current rule if it could be nested inside the previous rule
								if (shouldFix) {
									fixNestingAtRule(rule, prev);

									isProcessing = true;
								} else {
									report(rule, prev, result);
								}
							} else if (areRulesPotentialNestingAtRule(prev, rule, opts)) {
								// fix or report the previous rule if it could be nested inside the current rule
								if (shouldFix) {
									fixNestingAtRule(prev, rule);

									isProcessing = true;
								} else {
									report(prev, rule, result);
								}
							} else if (areRulesPotentialNestingMediaRule(rule, prev, opts)) {
								// fix or report the current rule if it could be nested inside the previous rule
								if (shouldFix) {
									fixNestingMediaRule(rule, prev);

									isProcessing = true;
								} else {
									report(rule, prev, result);
								}
							} else if (areRulesPotentialNestingMediaRule(prev, rule, opts)) {
								// fix or report the current rule if it could be nested inside the previous rule
								if (shouldFix) {
									fixNestingMediaRule(prev, rule);

									isProcessing = true;
								} else {
									report(prev, rule, result);
								}
							}
						}
					}
				});
			}
		}
	};
});

export const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (node, prev) => {
		const outside = prev.type === 'atrule' ? `@${prev.name} ${prev.params}` : node.selector;
		const inside = prev.type === 'atrule' ? node.selector : prev.selector;
		const message = `Expected "${outside}" inside "${inside}".`;

		return message;
	}
});

const report = (rule1, rule2, result) => {
	stylelint.utils.report({
		message: messages.expected(rule1, rule2),
		node: rule1,
		result,
		ruleName
	});
};
