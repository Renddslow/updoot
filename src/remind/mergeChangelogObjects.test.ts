import test from 'ava';
import mergeChangelogObjects from './mergeChangelogObjects';

test('mergeChangelogObjects - returns an object', (t) => {
  t.is(mergeChangelogObjects({}, {}).toString(), '[object Object]');
});

test('mergeChangelogObjects - combines contents, favoring the left "level"', (t) => {
  const a = {
    added: {
      changes: ['Sun', 'Moon', 'Stars', 'Divine Beings'],
      level: 2,
    },
    updated: {
      changes: ['Light source', 'Self-governance'],
      level: 2,
    },
  };
  const b = {
    added: {
      changes: ['Trees', 'Seed-bearing fruit', 'Foliage'],
      level: 3,
    },
    updated: {
      changes: ['Land and sea are now separate components'],
      level: 3,
    },
    removed: {
      changes: ['Chaos'],
      level: 3,
    },
  };
  const expected = {
    added: {
      changes: ['Sun', 'Moon', 'Stars', 'Divine Beings', 'Trees', 'Seed-bearing fruit', 'Foliage'],
      level: 2,
    },
    updated: {
      changes: ['Light source', 'Self-governance', 'Land and sea are now separate components'],
      level: 2,
    },
    removed: {
      changes: ['Chaos'],
      level: 3,
    },
  };
  t.deepEqual(mergeChangelogObjects(a, b), expected);
});
