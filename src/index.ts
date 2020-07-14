#!usr/bin/env node
'use strict';
import sade from 'sade';

sade('verify-changelog', true)
  .describe(
    'Verify that updates to the pkg.version in a commit are accompanied by a changelog entry.',
  )
  .option('-i, --ignore-level', 'Ignore a version level (major | minor | patch | pre-release)')
  .option(
    '-w, --workspace',
    'When set verify-changelog will look for a yarn workspace setup',
    false,
  )
  .option('-s, --solo', 'Run this as a standalone CLI, just verify and prompt, no git stuff', false)
  .option(
    '--warn-only',
    'When verify-changelog finds a missing changelog entry, it will only warn and exit',
    false,
  )
  .action((opts) => {
    console.log(opts);
  })
  .parse(process.argv);
