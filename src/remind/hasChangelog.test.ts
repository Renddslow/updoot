import test from 'ava';

import hasChangelog from './hasChangelog';

test('hasChangelog - returns a boolean', (t) => {
  t.true(typeof hasChangelog([]) === 'boolean');
});

test('hasChangelog - returns true when changelog is present', (t) => {
  t.true(hasChangelog(['CHANGELOG.md', 'package.json']));
});

test('hasChangelog - returns true when there is a longer path before changelog', (t) => {
  t.true(hasChangelog(['path/to/the/CHANGELOG.md', 'path/to/the/spackage.json']));
});

test('hasChangelog - returns false when changelog is not present', (t) => {
  t.false(hasChangelog(['package.json']));
});

test('hasChangelog - returns true when changelog is present (alt pattern)', (t) => {
  t.true(hasChangelog(['LATEST_UPDOOTS', 'package.json'], 'latest_updoot*'));
});

test('hasChangelog - returns false when changelog is not present (alt pattern)', (t) => {
  t.false(hasChangelog(['CHANGELOG.md', 'package.json'], 'latest_updoot*'));
});
