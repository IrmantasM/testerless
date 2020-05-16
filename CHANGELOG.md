# CHANGELOG

## WIP [0.0.3] - 2020-05-16

### Added

- [WIP] Testerless now supports API Gateway request type

### Changed

- Refactored yml structure to accommodate new feature to allow making requests via API Gateway
- Refactored `tester.js`
  - Moved parsing logic into a `parser.js` custom library
- Created classes for Function, Request, Response, Test and TestConfig to make use of OOP benefits
- Added required logic to handle custom response
- Updated README
- Updated example files

## [0.0.2] - 2020-05-13

### Added

- Added SonarCloud integration for static code analysis
- Added Snyk integration for vulnerability scanning

### Changed

- Updated README.md with SonarCloud security badge
- Updated README.md with Snyk badge

## [0.0.1] - 2020-05-13

Initial release!

### Added

- "Testerless" basic RequestResponse by status code functionality & documentation.
