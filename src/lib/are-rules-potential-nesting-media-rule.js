export default function areRulesPotentialNestingMediaRule(rule1, rule2, opts) {
	const except = [].concat(Object(opts).except || []);
	const only = [].concat(Object(opts).only || []);

	const isRule2MediaRule = rule2.type === 'atrule' && rule2.name === 'media';
	const rule3 = isRule2MediaRule && rule2.nodes && rule2.nodes[0];

	return rule1 && rule3 &&
	rule1.selector && rule3.selector &&
	rule1.selector === rule3.selector &&
	(!except.length || except.some(
		entry => entry instanceof RegExp
			? !entry.test(rule1.selector)
		: entry !== rule1.selector
	)) &&
	(!only.length || only.some(
		entry => entry instanceof RegExp
			? entry.test(rule1.selector)
		: entry === rule1.selector
	));
}
