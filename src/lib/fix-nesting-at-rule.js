import postcss from 'postcss';

export default function fixNestingAtRule(rule1, rule2, opts) {
	rule1.remove();

	rule1.selectors = rule1.selectors.map(
		selector => `${selector.slice(0, -rule2.selector.length - 1)} &`
	);

	const ruleOrAtRule = postcss.rule({
		selector: String(rule1.selector),
	});

	const rule = Object.assign(
		ruleOrAtRule,
		{
			raws: Object.assign(rule1.raws, {
				afterName: ' '
			}),
			source: rule1.source
		}
	);

	rule.append(...rule1.nodes);

	rule2.append(rule);
}
