import postcss from 'postcss';

export default function fixNestingAtRule(rule1, rule2) {
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
}
