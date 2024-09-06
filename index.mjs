import stylelint from 'stylelint';

import is from './lib/is.mjs';
import areRulesPotentialNestingAtRule from './lib/are-rules-potential-nesting-at-rule.mjs';
import areRulesPotentialNestingMediaRule from './lib/are-rules-potential-nesting-media-rule.mjs';
import areRulesPotentialNestingRule from './lib/are-rules-potential-nesting-rule.mjs';
import fixNestingAtRule from './lib/fix-nesting-at-rule.mjs';
import fixNestingMediaRule from './lib/fix-nesting-media-rule.mjs';
import fixNestingRule from './lib/fix-nesting-rule.mjs';

const ruleName = 'csstools/use-nesting';

const meta = {
	url: 'https://github.com/csstools/stylelint-use-nesting',
	fixable: true,
};

const ruleFunction = (action, opts) => {
	return async (root, result) => {
		// validate the action
		const isActionValid = stylelint.utils.validateOptions(result, ruleName, {
			actual: action,
			possible() {
				return is(action, [ 'always', 'ignore', true, false, null ]);
			}
		});

		if (isActionValid) {
			if (is(action, [ 'always', true ])) {
				result.root.walk(rule => {
					let isProcessing = true;

					while (isProcessing) {
						isProcessing = false;

						const prev = rule.prev();

						const isRuleValid = rule && (rule.type === 'rule' || rule.type === 'atrule');
						const isPrevValid = prev && (prev.type === 'rule' || prev.type === 'atrule');

						// if the previous node is also a rule
						if (!isRuleValid || !isPrevValid) {
							continue;
						}

						if (areRulesPotentialNestingRule(rule, prev, opts)) {
							report(
								rule,
								prev,
								result,
								() => {
									isProcessing = true;

									fixNestingRule(rule, prev)
								}
							);

							continue;
						}

						if (areRulesPotentialNestingRule(prev, rule, opts)) {
							report(
								prev,
								rule,
								result,
								() => {
									isProcessing = true;

									fixNestingRule(prev, rule)
								}
							);

							continue;
						}

						if (areRulesPotentialNestingAtRule(rule, prev, opts)) {
							report(
								rule,
								prev,
								result,
								() => {
									isProcessing = true;

									fixNestingAtRule(rule, prev, opts);
								}
							);

							continue;
						}

						if (areRulesPotentialNestingAtRule(prev, rule, opts)) {
							report(
								prev,
								rule,
								result,
								() => {
									isProcessing = true;

									fixNestingAtRule(prev, rule, opts);
								}
							);

							continue;
						}

						if (areRulesPotentialNestingMediaRule(rule, prev, opts)) {
							report(
								rule,
								prev,
								result,
								() => {
									isProcessing = true;

									fixNestingMediaRule(rule, prev);
								}
							);

							continue;
						}

						if (areRulesPotentialNestingMediaRule(prev, rule, opts)) {
							report(
								prev,
								rule,
								result,
								() => {
									isProcessing = true;

									fixNestingMediaRule(prev, rule);
								}
							);

							continue;
						}
					}
				});
			}
		}
	};
}

const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (node, prev) => {
		const outside = prev.type === 'atrule' ? `@${prev.name} ${prev.params}` : node.selector;
		const inside = prev.type === 'atrule' ? node.selector : prev.selector;
		const message = `Expected "${outside}" inside "${inside}".`;

		return message;
	}
});

const report = (rule1, rule2, result, fix) => {
	stylelint.utils.report({
		message: messages.expected(rule1, rule2),
		node: rule1,
		result,
		ruleName,
		fix
	});
};

ruleFunction.ruleName = ruleName;
ruleFunction.meta = meta;
ruleFunction.messages = messages;

export default stylelint.createPlugin(ruleName, ruleFunction);
