export default function fixNestingRule(rule1, rule2) {
	rule1.selectors = rule1.selectors.map(
		selector => `&${selector.slice(rule2.selector.length)}`
	);

	rule2.append(rule1);
}
