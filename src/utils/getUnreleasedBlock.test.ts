import test from 'ava';

import getUnreleasedBlock from './getUnreleasedBlock';

test('getUnreleasedBlock - returns changelog string', (t) => {
  t.is(typeof getUnreleasedBlock(''), 'string');
});

test(`getUnreleasedBlock - returns a Changelog string with just the contents of the unreleased block`, (t) => {
  const input = `
## [Unreleased]

### Added

- Giraffes
- Dinosaurs

### Removed

- Unicorns

## [1.0.0] - 2020-01-01

### Added

- Light
  `;

  const expected = `
### Added

-   Giraffes
-   Dinosaurs

### Removed

-   Unicorns
  `;

  t.is(getUnreleasedBlock(input), expected.trim() + '\n');
});

test('getUnreleasedBlock - returns unreleased block regardless of frontmatter', (t) => {
  const input = `
# Changelog

This document tracks all the changes since we started.

## [Unreleased]

### Added

- Humans
- A nifty garden
  `;

  const expected = `
### Added

-   Humans
-   A nifty garden  
  `;

  t.is(getUnreleasedBlock(input), expected.trim() + '\n');
});
