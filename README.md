# Stylelint Use Nesting [<img src="https://jonathantneal.github.io/stylelint-logo.svg" alt="stylelint" width="90" height="90" align="right">][stylelint]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[Stylelint Use Nesting] is a [stylelint] rule to enforce nesting when it is
possible in CSS.

## Usage

Add [stylelint] and [Stylelint Use Nesting] to your project.

```bash
npm install stylelint stylelint-use-nesting --save-dev
```

Add [Stylelint Use Nesting] to your [stylelint configuration].

```js
{
  "plugins": [
    "stylelint-use-nesting"
  ],
  "rules": {
    "csstools/use-nesting": "always" || "ignore"
  }
}
```

## Options

### always

If the first option is `"always"` or `true`, then [Stylelint Use Nesting]
requires all nodes to be linted, and the following patterns are _not_
considered violations:

```pcss
.example {
  color: blue;

  &:hover {
    color: rebeccapurple;
  }
}
```

```pcss
.example {
  color: blue;

  @media (min-width: 640px) {
    color: rebeccapurple;
  }
}
```

While the following patterns are considered violations:

```pcss
.example {
  color: blue;
}

.example:hover {
  color: rebeccapurple;
}
```

```pcss
.example {
  color: blue;
}

@media (min-width: 640px) {
  .example {
    color: rebeccapurple;
  }
}
```

### ignore

If the first option is `"ignore"` or `null`, then [Stylelint Use Nesting] does
nothing.

## Secondary Options

### except

The `except` option ignores reporting or autofixing rules where the potentially
nesting portion of the selector matches a case-insensitive string or regular
expression.

```js
{
  "rules": {
    "csstools/use-nesting": ["always", { "except": [':selection', /^:dir/i] }]
  }
}
```

### only

The `except` option limits reporting and autofixing to rules where the
potentially nesting portion of the selector matches a case-insensitive string
or regular expression.

```js
{
  "rules": {
    "csstools/use-nesting": ["always", { "only": ['.js', /^:(hover|focus)/i] }]
  }
}
```

[cli-img]: https://img.shields.io/travis/csstools/stylelint-use-nesting/master.svg
[cli-url]: https://travis-ci.org/csstools/stylelint-use-nesting
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/stylelint/stylelint
[npm-img]: https://img.shields.io/npm/v/stylelint-use-nesting.svg
[npm-url]: https://www.npmjs.com/package/stylelint-use-nesting

[stylelint]: https://github.com/stylelint/stylelint
[stylelint configuration]: https://github.com/stylelint/stylelint/blob/master/docs/user-guide/configuration.md#readme
[Stylelint Use Nesting]: https://github.com/csstools/stylelint-use-nesting
