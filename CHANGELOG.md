# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/MetaMask/abi-utils/compare/v1.1.1...HEAD
[1.1.1]: https://github.com/MetaMask/abi-utils/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/MetaMask/abi-utils/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/MetaMask/abi-utils/releases/tag/v1.0.0
