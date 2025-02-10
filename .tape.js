export default {
	'csstools/use-nesting': [
		/* Test Nesting Rules */
		{
			source: '.foo { color: blue; } .foo:hover, .foo:focus { color: rebeccapurple; } .foo:focus-within { color: red; }',
			warnings: [
				'Expected ".foo:hover, .foo:focus" inside ".foo". (csstools/use-nesting)'
			]
		},
		{
			source: '.foo { color: blue; } .foo:hover, .foo:focus { color: rebeccapurple; } .foo:focus-within { color: red; }',
			warnings: 0,
			args: ['always', { except: /^:(hover|:focus)$/i }]
		},
		{
			source: '.foo { color: blue; } .foo:hover, .foo:focus { color: rebeccapurple; } .foo:focus-within { color: red; }',
			warnings: 0,
			args: ['always', { only: /^:focus-within$/i }]
		},
		{
			source: '.foo { color: blue; } .foo:hover, .foo:focus { color: rebeccapurple; } .foo:focus-within { color: red; }',
			expect: '.foo { color: blue; &:hover, &:focus { color: rebeccapurple; } &:focus-within { color: red; } }',
			args: ['always']
		},
		{
			source: '.foo { color: blue; } .foo[data-bar] { color: red; }',
			expect: '.foo { color: blue; &[data-bar] { color: red; } }',
			args: ['always']
		},
		{
			source: '.foo { color: blue; } .foo:hover, .foo:focus { color: rebeccapurple; } .foo:focus-within { color: red; }',
			expect: '.foo { color: blue; &:hover, &:focus { color: rebeccapurple; } } .foo:focus-within { color: red; }',
			args: ['always', { except: /^:focus-within/i }]
		},
		{
			source: '.foo { color: blue; } .foo:hover, .foo:focus { color: rebeccapurple; } .foo:focus-within { color: red; }',
			expect: '.foo { color: blue; &:hover, &:focus { color: rebeccapurple; } } .foo:focus-within { color: red; }',
			args: ['always', { except: ':focus-within' }]
		},
		{
			source: '.foo { color: blue; } .foo:hover, .foo:focus { color: rebeccapurple; } .foo:focus-within { color: red; }',
			expect: '.foo { color: blue; &:hover, &:focus { color: rebeccapurple; } } .foo:focus-within { color: red; }',
			args: ['always', { only: /^:(hover|focus)$/i }]
		},
		{
			source: '.foo { color: blue; } .foo:hover, .foo:focus { color: rebeccapurple; } .foo:focus-within { color: red; }',
			expect: '.foo { color: blue; &:hover, &:focus { color: rebeccapurple; } } .foo:focus-within { color: red; }',
			args: ['always', { only: [':hover', ':focus'] }]
		},
		{
			source: ':host { color: blue; } :host(.foo) { color: rebeccapurple; }',
			expect: ':host { color: blue; } :host(.foo) { color: rebeccapurple; }',
			args: ['always']
		},

		/* Test Nesting At-Rules */
		{
			source: '.foo { color: blue; } body .foo { color: rebeccapurple; } html .foo { color: red; }',
			warnings: 1
		},
		{
			source: '.foo { color: blue; } body .foo { color: rebeccapurple; } html .foo { color: red; }',
			warnings: 0,
			args: ['always', { except: /^body$/i }]
		},
		{
			source: '.foo { color: blue; } body .foo { color: rebeccapurple; } html .foo { color: red; }',
			warnings: 0,
			args: ['always', { only: /^html$/i }]
		},

		// Proposal nesting syntax
		{
			source: '.foo { color: blue; } body .foo { color: rebeccapurple; } html .foo { color: red; }',
			expect: '.foo { color: blue; body & { color: rebeccapurple; } html & { color: red; } }',
			args: ['always']
		},
		{
			source: '.foo { color: blue; } body .foo { color: rebeccapurple; } html .foo { color: red; }',
			expect: '.foo { color: blue; body & { color: rebeccapurple; } } html .foo { color: red; }',
			args: ['always', { except: /^html$/i }]
		},
		{
			source: '.foo { color: blue; } body .foo { color: rebeccapurple; } html .foo { color: red; }',
			expect: '.foo { color: blue; body & { color: rebeccapurple; } } html .foo { color: red; }',
			args: ['always', { except: 'html' }]
		},
		{
			source: '.foo { color: blue; } body .foo { color: rebeccapurple; } html .foo { color: red; }',
			expect: '.foo { color: blue; body & { color: rebeccapurple; } } html .foo { color: red; }',
			args: ['always', { only: /^body$/i }]
		},
		{
			source: '.foo { color: blue; } body .foo { color: rebeccapurple; } html .foo { color: red; }',
			expect: '.foo { color: blue; body & { color: rebeccapurple; } } html .foo { color: red; }',
			args: ['always', { only: 'body' }]
		},

		// SCSS nesting syntax
		{
			source: '.foo { color: blue; } body .foo { color: rebeccapurple; } html .foo { color: red; }',
			expect: '.foo { color: blue; body & { color: rebeccapurple; } html & { color: red; } }',
			args: ['always', { syntax: 'scss' }]
		},
		{
			source: '.foo { color: blue; } body .foo { color: rebeccapurple; } html .foo { color: red; }',
			expect: '.foo { color: blue; body & { color: rebeccapurple; } } html .foo { color: red; }',
			args: ['always', { syntax: 'scss', except: /^html$/i }]
		},
		{
			source: '.foo { color: blue; } body .foo { color: rebeccapurple; } html .foo { color: red; }',
			expect: '.foo { color: blue; body & { color: rebeccapurple; } } html .foo { color: red; }',
			args: ['always', { syntax: 'scss', except: 'html' }]
		},
		{
			source: '.foo { color: blue; } body .foo { color: rebeccapurple; } html .foo { color: red; }',
			expect: '.foo { color: blue; body & { color: rebeccapurple; } } html .foo { color: red; }',
			args: ['always', { syntax: 'scss', only: /^body$/i }]
		},
		{
			source: '.foo { color: blue; } body .foo { color: rebeccapurple; } html .foo { color: red; }',
			expect: '.foo { color: blue; body & { color: rebeccapurple; } } html .foo { color: red; }',
			args: ['always', { syntax: 'scss', only: 'body' }]
		},

		/* Test Nesting Media Rules */
		{
			source: '.foo { color: blue; } @media (min-width: 960px) { .foo { color: rebeccapurple; } }',
			warnings: [
				'Expected "@media (min-width: 960px)" inside ".foo". (csstools/use-nesting)'
			]
		},
		{
			source: '.foo { color: blue; } @media (min-width: 960px) { .foo { color: rebeccapurple; } }',
			warnings: 0,
			args: ['always', { except: /foo$/i }]
		},
		{
			source: '.foo { color: blue; } @media (min-width: 960px) { .foo { color: rebeccapurple; } }',
			warnings: 0,
			args: ['always', { only: /bar/i }]
		},
		{
			source: '.foo { color: blue; } @media (min-width: 960px) { .foo { color: rebeccapurple; } }',
			expect: '.foo { color: blue; @media (min-width: 960px) { color: rebeccapurple } }',
			args: ['always']
		},

		/* Test Ignores Rules */
		{
			source: '.foo { color: blue; } .foo__bar { color: rebeccapurple; } .foo--bar { color: red; }',
			warnings: 0,
			args: ['always']
		},
		{
			source: '.foo { color: blue; } .foo__bar { color: rebeccapurple; } .foo--bar { color: red; }',
			expect: '.foo { color: blue; } .foo__bar { color: rebeccapurple; } .foo--bar { color: red; }',
			args: ['always']
		},
		{
			source: '.test-foo__bar {} .test-foo__bar svg, .test-qux__bar svg {}',
			expect: '.test-foo__bar {} .test-foo__bar svg, .test-qux__bar svg {}',
			warnings: 0,
			args: ['always']
		}
	]
};
