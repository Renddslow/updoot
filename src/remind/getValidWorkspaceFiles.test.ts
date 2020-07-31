import test from 'ava';

import getValidWorkspaceFiles from './getValidWorkspaceFiles';

test('getValidWorkspaceFiles - returns an Object', (t) => {
  const res = getValidWorkspaceFiles([], [], []);
  t.is(res.toString(), '[object Object]');
});

test('getValidWorkspaceFiles - given a series of files, return only the files in the yarn workspaces', (t) => {
  const files = [
    'package.json',
    'packages/app/package.json',
    'packages/app/CHANGELOG',
    'packages/app/README.md',
    'packages/api/server.js',
    'packages/api/package.json',
    '.gitignore',
  ];
  const workspaces = ['packages/*'];
  const expected = {
    'packages/api': {
      name: 'api',
      files: ['packages/api/server.js', 'packages/api/package.json'],
    },
    'packages/app': {
      name: 'app',
      files: ['packages/app/package.json', 'packages/app/CHANGELOG', 'packages/app/README.md'],
    },
  };
  t.deepEqual(getValidWorkspaceFiles(files, workspaces, []), expected);
});

test('getValidWorkspaceFiles - given a series of files, return only the files in the yarn workspaces (even nested workspaces)', (t) => {
  const files = [
    'package.json',
    'packages/app/package.json',
    'packages/api/package.json',
    'apis/files/data/package.json',
    '.gitignore',
  ];
  const workspaces = ['packages/*', 'apis/files/*'];
  const expected = {
    'packages/api': {
      name: 'api',
      files: ['packages/api/package.json'],
    },
    'packages/app': {
      name: 'app',
      files: ['packages/app/package.json'],
    },
    'apis/files/data': {
      name: 'data',
      files: ['apis/files/data/package.json'],
    },
  };
  t.deepEqual(getValidWorkspaceFiles(files, workspaces, []), expected);
});

test('getValidWorkspaceFiles - given a series of files, return only the files in the yarn workspaces, ignoring ignored packages', (t) => {
  const files = [
    'package.json',
    'packages/app/package.json',
    'packages/api/package.json',
    'apis/files/data/package.json',
    'apis/files/solid/package.json',
    '.gitignore',
  ];
  const workspaces = ['packages/*', 'apis/files/*'];
  const ignored = ['solid'];
  const expected = {
    'packages/api': {
      name: 'api',
      files: ['packages/api/package.json'],
    },
    'packages/app': {
      name: 'app',
      files: ['packages/app/package.json'],
    },
    'apis/files/data': {
      name: 'data',
      files: ['apis/files/data/package.json'],
    },
  };
  t.deepEqual(getValidWorkspaceFiles(files, workspaces, ignored), expected);
});
