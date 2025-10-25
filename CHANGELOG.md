# Changelog

All notable changes to this project will be documented here.

## [1.0.9] - 2025-10-19

- Added stripQuotes to sanitize selections & fixed multiple terminal instance when running l10n cmd.

## [1.0.8] - 2025-10-19

### Added

- Major localization workflow improvements:
  - Quick Fix to add selected strings to .arb localization files with automatic camelCase key generation.
  - Adds value to English .arb files, empty value to other .arb files.
  - Replaces the selected string in code with the generated key, using a configurable prefix.
  - Automatically creates a l10n/app_en.arb if none exists.
  - New configuration: `eazyflutter.localizationKeyPrefix` to set a prefix before the key in code.
  - New configuration: `eazyflutter.autoL10nGenerate` to auto-run `flutter gen-l10n` or `fvm flutter gen-l10n` after .arb updates, with FVM detection.

### Fixed

- Improved FVM detection and command execution for localization generation.

## [1.0.7]

- Fixed version mismatch that caused some functions to not work.

## [1.0.6] - 2025-10-16

### Added

- Quick Fix: Add selected string to .arb localization files with automatic key generation and replacement in code.

## [1.0.5] - 2025-05-04

- Bug fixes

## [1.0.4] - 2025-03-20

### Minor changes

- Extension download size has been reduced.
- Automatically opens dart file after JSON generation.
- Logo update

## [1.0.3] - 2025-03-19

### Fixed

- Fixed JSON to Dart model naming issue.
- Improved widget detection logic.
- Auto import provider package for Consumer
- Code optimization and bug fixes.

## [1.0.2] - 2025-03-17

### Changed

- Code refactoring.
- General bug fixes.

## [1.0.1] - 2025-03-17

### Fixed

- Fixed JSON to Dart conversion issues.
- Bug fixes.

## [1.0.0] - 2025-03-17

### Added

- Initial release.
