# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.3]
### Uncategorized
- Bump the npm_and_yarn group across 1 directory with 2 updates ([#76](https://github.com/MetaMask/abi-utils/pull/76))
- Bump tar in the npm_and_yarn group across 1 directory ([#74](https://github.com/MetaMask/abi-utils/pull/74))
- Update CODEOWNERS ([#71](https://github.com/MetaMask/abi-utils/pull/71))
- Enabling MetaMask security code scanner ([#68](https://github.com/MetaMask/abi-utils/pull/68))
- Add Shared Libraries team in codeowners file ([#66](https://github.com/MetaMask/abi-utils/pull/66))
- Bump @metamask/utils from 8.2.1 to 8.3.0 ([#67](https://github.com/MetaMask/abi-utils/pull/67))
- Bump @metamask/auto-changelog from 3.4.3 to 3.4.4 ([#65](https://github.com/MetaMask/abi-utils/pull/65))
- Bump @metamask/utils from 8.2.0 to 8.2.1 ([#64](https://github.com/MetaMask/abi-utils/pull/64))
- Bump @metamask/auto-changelog from 3.4.2 to 3.4.3 ([#63](https://github.com/MetaMask/abi-utils/pull/63))
- Bump @metamask/auto-changelog from 3.4.1 to 3.4.2 ([#62](https://github.com/MetaMask/abi-utils/pull/62))
- Bump @metamask/auto-changelog from 3.4.0 to 3.4.1 ([#61](https://github.com/MetaMask/abi-utils/pull/61))
- Bump postcss from 8.4.23 to 8.4.31 ([#60](https://github.com/MetaMask/abi-utils/pull/60))
- Bump @babel/traverse from 7.22.8 to 7.23.2 ([#59](https://github.com/MetaMask/abi-utils/pull/59))
- Bump @metamask/auto-changelog from 3.2.0 to 3.4.0 ([#57](https://github.com/MetaMask/abi-utils/pull/57))
- Bump @metamask/utils from 8.1.0 to 8.2.0 ([#58](https://github.com/MetaMask/abi-utils/pull/58))
- Bump @metamask/eslint-config from 12.1.0 to 12.2.0 ([#55](https://github.com/MetaMask/abi-utils/pull/55))

### Changed
- Bump `@metamask/utils` from `^8.4.0` to `^8.5.0` ([#73](https://github.com/MetaMask/abi-utils/pull/73))

### Fixed
- Replace dependency `superstruct` with `@metamask/superstruct` `^3.0.0` ([#73](https://github.com/MetaMask/abi-utils/pull/73))
  - This fixes the issue of this package being unusable by any TypeScript project that uses `Node16` or `NodeNext` as its `moduleResolution` option.

## [2.0.2]
### Changed
- Bump @metamask/utils from ^6.1.0 to ^8.1.0 ([#41](https://github.com/MetaMask/abi-utils/pull/41)) ([#50](https://github.com/MetaMask/abi-utils/pull/50)) ([#51](https://github.com/MetaMask/abi-utils/pull/51))

## [2.0.1]
### Changed
- Bump @metamask/utils from ^5.0.2 to ^6.1.0 ([#35](https://github.com/MetaMask/abi-utils/pull/35))

## [2.0.0]
### Changed
- **BREAKING**: The minimum Node.js version is now 16 ([#32](https://github.com/MetaMask/abi-utils/pull/32))

## [1.2.0]
### Changed
- Decrease minimum supported Node.js version to v14 ([#30](https://github.com/MetaMask/abi-utils/pull/30))

## [1.1.1]
### Fixed
- Bump `superstruct` and `@metamask/utils` ([#25](https://github.com/MetaMask/abi-utils/pull/25))

## [1.1.0]
### Added
- Add non-standard packed mode ([#15](https://github.com/MetaMask/abi-utils/pull/15))
  - This adds a new function `encodePacked`, which matches the behaviour of `abi.encodePacked` in Solidity

### Changed
- Allow byte values shorter than specified size ([#12](https://github.com/MetaMask/abi-utils/pull/12))
- Add better validation of number type and value ([#13](https://github.com/MetaMask/abi-utils/pull/13))
  - Number values are now checked if they are within the bounds of the type

## [1.0.0]
### Added
- Initial release

[Unreleased]: https://github.com/MetaMask/abi-utils/compare/v2.0.3...HEAD
[2.0.3]: https://github.com/MetaMask/abi-utils/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/MetaMask/abi-utils/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/MetaMask/abi-utils/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/MetaMask/abi-utils/compare/v1.2.0...v2.0.0
[1.2.0]: https://github.com/MetaMask/abi-utils/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/MetaMask/abi-utils/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/MetaMask/abi-utils/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/MetaMask/abi-utils/releases/tag/v1.0.0
