export default function fixNestingMediaRule(rule1, media) {
	const isMediaMediaRule = media.type === 'atrule' && media.name === 'media';

	if (isMediaMediaRule) {
		const rule2 = media.nodes[0];
		const mediaRule = media.clone().removeAll();

		mediaRule.append(
			rule2.nodes.map(node => node.clone())
		);

		rule1.append(mediaRule);

		rule2.remove();

		if (!media.nodes.length) {
			media.remove();
		}
	}
}
