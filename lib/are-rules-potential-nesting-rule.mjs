export default function areRulesPotentialNestingRule(rule1, rule2, opts) {
	const except = [].concat(Object(opts).except || []);
	const only = [].concat(Object(opts).only || []);

	const result = rule1.selectors && rule2.selectors && rule2.selectors.every(
		rule2Selector => rule1.selectors.every(
			rule1Selector =>
				rule2Selector.length < rule1Selector.length &&
				rule2Selector === rule1Selector.slice(0, rule2Selector.length) &&
				!/^[A-Za-z0-9-_]/.test(rule1Selector.slice(rule2Selector.length)) &&
				rule1Selector[rule2Selector.length] !== '(' &&
				(!except.length || except.some(
					entry => entry instanceof RegExp
						? !entry.test(rule1Selector.slice(rule2Selector.length))
					: entry !== rule1Selector.slice(rule2Selector.length)
				)) &&
				(!only.length || only.some(
					entry => entry instanceof RegExp
						? entry.test(rule1Selector.slice(rule2Selector.length))
					: entry === rule1Selector.slice(rule2Selector.length)
				))
		)
	);
	return result
}
