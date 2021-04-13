import console from 'console';

import { PackageJson } from 'read-pkg-up';
import kleur from 'kleur';

import getValidWorkspaceFiles from './getValidWorkspaceFiles';
import hasChangelog from './hasChangelog';
import getChangelogPaths from './getChangelogPaths';

export default async (
  files: Array<string>,
  workspaces: string,
  warn: boolean,
  ignore: string,
  pkg: PackageJson,
  pattern: string = 'changelog*',
) => {
  if (process.env.SKIP_UPDOOT && process.env.SKIP_UPDOOT === 'true') {
    console.log(kleur.gray('Skipping updoot'));
    process.exit(0);
  }

  const filesLocalized = files.map((f) => f.replace(`${process.cwd()}/`, ''));
  const filteredFiles = workspaces
    ? getValidWorkspaceFiles(filesLocalized, <Array<string>>pkg.workspaces, ignore.split(','))
    : {
        _: {
          name: '@root',
          files: filesLocalized,
        },
      };

  const missingChangelogs = Object.keys(filteredFiles).filter(
    (k) => !hasChangelog(filteredFiles[k].files, pattern),
  );

  const changelogPaths = await getChangelogPaths(missingChangelogs, pattern);
  if (!changelogPaths.length) {
    console.log(kleur.green('All changelog entries are present!'));
    process.exit(0);
  }

  const plural = changelogPaths.length > 1;
  const log = warn ? console.log : console.error;

  log(
    kleur.bold(
      `${changelogPaths.length} changelog update${plural ? 's' : ''} appear${
        plural ? '' : 's'
      } to be missing in this commit:\n`,
    ),
  );
  changelogPaths.forEach((file, idx) => {
    log(` ${kleur.gray(`[${idx + 1}/${changelogPaths.length}]`)} ${file}`);
  });
  process.exit(warn ? 0 : 1);
};
