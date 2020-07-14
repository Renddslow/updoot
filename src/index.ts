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
  .action((opts) => {
    console.log(opts);
  })
  .parse(process.argv);
