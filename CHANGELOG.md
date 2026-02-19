# Changes to Stylelint Use Nesting

### 6.0.2

- Fix false positive with selectors containing `&`
- Fix false positive with selectors containing pseudo elements
- Fix false positive with relative selectors

### 6.0.1

- Fix false positive with functional pseudo classes (e.g. `:host` vs. `:host()`) [#24](https://github.com/csstools/stylelint-use-nesting/pull/24) by @veyndan

### 6.0.0

- Updated: minimum Stylelint version to `v16.9.0`
- Updated: use the new `report.fix` API

### 5.1.2 (Jul 28, 2024)

- Fix `Unknown rule csstools/use-nesting` error

### 5.1.1 (March 6, 2024)

- Remove `exports` field from `package.json` [#18](https://github.com/csstools/stylelint-use-nesting/issues/18)

### 5.1.0 (March 3, 2024)

- Remove `@nest` [#15](https://github.com/csstools/stylelint-use-nesting/issues/15)

### 5.0.0 (March 3, 2024)

- Updated: peer `stylelint` to >= 16 (major)
- Updated: Node 20+ compatibility (major)
- Drop commonjs support (major)

### 4.1.0 (March 8, 2022)

- Added: support for SCSS syntax

### 4.0.0 (Jul 29, 2022)

- Updated: peer `stylelint` to >= 10 (major)
- Updated: Node 16+ compatibility (major)
- Added: attribute selector support (minor)

### 3.0.0 (May 12, 2020)

- Updated: peer `stylelint` to 10 - 13 (major)
- Updated: Node 10+ compatibility (major)

### 2.0.0 (May 12, 2018)

- Updated: peer `stylelint` to 10.0.1 (major)
- Updated: Node 8+ compatibility (major)

### 1.2.1 (February 27, 2019)

- Fixed an issue with nested media not warning correctly

### 1.2.0 (February 26, 2019)

- Added support for nestable `@media` queries
- Added support for recursive changes

### 1.1.0 (November 27, 2018)

- Added `except` and `only` options to future configure nesting rules

### 1.0.0 (November 25, 2018)

- Initial version
