import assert from 'node:assert';
import test from 'node:test';
import postcss from 'postcss';

import canRulesBeRewrittenWithNesting from '../lib/can-rules-be-rewritten-with-nesting.mjs';

test('.foo / .foo:hover', () => {
	assert.ok(canRulesBeRewrittenWithNesting(
		postcss.rule({ selector: '.foo' }),
		postcss.rule({ selector: '.foo:hover' }),
		{}
	))
});

test('.foo / .foo:hover, .foo:focus', () => {
	assert.ok(canRulesBeRewrittenWithNesting(
		postcss.rule({ selector: '.foo' }),
		postcss.rule({ selector: '.foo:hover, .foo:focus' }),
		{}
	))
});

test('.foo / .foo:hover, .bar:focus', () => {
	assert.ok(!canRulesBeRewrittenWithNesting(
		postcss.rule({ selector: '.foo' }),
		postcss.rule({ selector: '.foo:hover, .bar:focus' }),
		{}
	))
});

test(':hover / .b:hover, .c:hover', () => {
	assert.ok(canRulesBeRewrittenWithNesting(
		postcss.rule({ selector: ':hover' }),
		postcss.rule({ selector: '.b:hover, .c:hover' }),
		{}
	))
});

test(':hover / .b:hover, .c:focus', () => {
	assert.ok(!canRulesBeRewrittenWithNesting(
		postcss.rule({ selector: ':hover' }),
		postcss.rule({ selector: '.b:hover, .c:focus' }),
		{}
	))
});

test('.a / .a &', () => {
	assert.ok(!canRulesBeRewrittenWithNesting(
		postcss.rule({ selector: '.a' }),
		postcss.rule({ selector: '.a &' }),
		{}
	))
});

test('.a & / .a', () => {
	assert.ok(!canRulesBeRewrittenWithNesting(
		postcss.rule({ selector: '.a &' }),
		postcss.rule({ selector: '.a' }),
		{}
	))
});

test('.a / .a::before', () => {
	assert.ok(!canRulesBeRewrittenWithNesting(
		postcss.rule({ selector: '.a' }),
		postcss.rule({ selector: '.a::before' }),
		{}
	))
});

test('.a::before / .a', () => {
	assert.ok(!canRulesBeRewrittenWithNesting(
		postcss.rule({ selector: '.a::before' }),
		postcss.rule({ selector: '.a' }),
		{}
	))
});

test('.a / > .a', () => {
	assert.ok(!canRulesBeRewrittenWithNesting(
		postcss.rule({ selector: '.a' }),
		postcss.rule({ selector: '> .a' }),
		{}
	))
});
