import test from 'ava';

import changelogObjectToText from './changelogObjectToText';

test('changelogObjectToText - returns a string', (t) => {
  t.is(typeof changelogObjectToText({}), 'string');
});

test('changelogObjectToText - returns a changelog string', (t) => {
  const input = {
    removed: {
      level: 3,
      changes: ['Leviathan', 'Chaos'],
    },
    added: {
      level: 3,
      changes: ['Sun', 'Moon', 'Stars'],
    },
  };
  const expected = `
### Added

- Sun
- Moon
- Stars

### Removed

- Leviathan
- Chaos
  `;
  t.is(changelogObjectToText(input), expected.trim() + '\n');
});

test('changelogObjectToText - returns a changelog with empties when preserved', (t) => {
  const input = {
    removed: {
      level: 3,
      changes: [],
    },
    added: {
      level: 3,
      changes: ['Sun', 'Moon', 'Stars'],
    },
    changed: {
      level: 3,
      changes: [],
    },
    fixed: {
      level: 3,
      changes: [],
    },
    security: {
      level: 3,
      changes: [],
    },
    deprecated: {
      level: 3,
      changes: [],
    },
  };

  const expected = `
### Added

- Sun
- Moon
- Stars

### Changed


### Deprecated


### Removed


### Fixed


### Security
  `;

  t.is(changelogObjectToText(input), expected.trim() + '\n');
});

test('changelogObjectToText - returns a changelog without empties when not preserved', (t) => {
  const input = {
    removed: {
      level: 3,
      changes: [],
    },
    added: {
      level: 3,
      changes: ['Sun', 'Moon', 'Stars'],
    },
    changed: {
      level: 3,
      changes: [],
    },
    fixed: {
      level: 3,
      changes: [],
    },
    security: {
      level: 3,
      changes: [],
    },
    deprecated: {
      level: 3,
      changes: [],
    },
  };

  const expected = `
### Added

- Sun
- Moon
- Stars
  `;

  t.is(changelogObjectToText(input, false), expected.trim() + '\n');
});
