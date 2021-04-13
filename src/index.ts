#!/usr/bin/env node
'use strict';
import sade from 'sade';
import pkgUp from 'read-pkg-up';

import remind from './remind';

interface Sade {
  command: (cmd: string) => Sade;
  describe: (description: string) => Sade;
  action: (cb: Function) => Sade;
  version: (version: string) => Sade;
  parse: (arg: any) => Sade;
  option: (flag: string, description?: string, _default?: any) => Sade;
}

(async function () {
  const prog = <Sade>sade('updoot');
  const { packageJson } = await pkgUp({ cwd: __dirname });

  prog.version(packageJson.version);

  prog
    .command('remind')
    .option(
      '-w, --workspace',
      'Whether or not updoot should look for changelogs in yarn workspaces',
      false,
    )
    .option('--warn', 'Print to stdout without an exit(1) when changelogs are missing.', false)
    .option(
      '-i, --ignore-pkgs',
      'When in a monorepo context, a comma-delimited list of packages to ignore',
    )
    .option(
      '--pattern',
      'A case-insensitive wildcard pattern describing the filename of changelogs',
      'changelog*',
    )
    .describe(
      'Checks to see if a Changelog is present in the list of changed files and alerts if one is not present.',
    )
    .action(async (opts) =>
      remind(
        opts._,
        opts.w,
        opts.warn,
        opts.i || '',
        (await pkgUp({ cwd: process.cwd() })).packageJson,
      ),
    );

  prog.parse(process.argv);
})();
