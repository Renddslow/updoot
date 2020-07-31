import test from 'ava';

import changelogTextToObject from './changelogTextToObject';

test('changelogTextToObject - returns object', (t) => {
  t.is(changelogTextToObject('').toString(), '[object Object]');
});

test('changelogTextToObject - correctly assigns proper titles to object', (t) => {
  const text = `
### Added

### Updated

### Removed
  `;

  const expected = {
    added: {
      changes: [],
      level: 3,
    },
    updated: {
      changes: [],
      level: 3,
    },
    removed: {
      changes: [],
      level: 3,
    },
  };
  t.deepEqual(changelogTextToObject(text), expected);
});

test('changelogTextToObject - correctly assigns changes to proper titles', (t) => {
  const text = `
### Added

- Fish 🐟
- Birds 🦜
- Windows in the sky dome

### Updated

- Sky above and sky below are now separate components

  `;

  const expected = {
    added: {
      changes: ['Fish 🐟', 'Birds 🦜', 'Windows in the sky dome'],
      level: 3,
    },
    updated: {
      changes: ['Sky above and sky below are now separate components'],
      level: 3,
    },
  };
  t.deepEqual(changelogTextToObject(text), expected);
});
