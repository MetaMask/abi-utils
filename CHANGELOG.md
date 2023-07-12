# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/MetaMask/abi-utils/compare/v2.0.1...HEAD
[2.0.1]: https://github.com/MetaMask/abi-utils/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/MetaMask/abi-utils/compare/v1.2.0...v2.0.0
[1.2.0]: https://github.com/MetaMask/abi-utils/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/MetaMask/abi-utils/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/MetaMask/abi-utils/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/MetaMask/abi-utils/releases/tag/v1.0.0
