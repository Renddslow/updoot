import readline from 'readline';
import console from 'console';
import fs from 'fs';
import { promisify } from 'util';

import { PackageJson } from 'read-pkg-up';
import kleur from 'kleur';
import ora from 'ora';

import getValidWorkspaceFiles from './getValidWorkspaceFiles';
import hasChangelog from './hasChangelog';
import getChangelogPaths from './getChangelogPaths';

const read = promisify(fs.readFile);

const question = (query: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer: string) => {
      rl.close();
      return resolve(answer);
    });
  });
};

export default async (
  files: Array<string>,
  workspaces: string,
  ignore: string,
  pkg: PackageJson,
  pattern: string = 'changelog*',
) => {
  const filteredFiles = workspaces
    ? getValidWorkspaceFiles(files, <Array<string>>pkg.workspaces, ignore.split(','))
    : {
        _: {
          name: '@root',
          files,
        },
      };

  const missingChangelogs = Object.keys(filteredFiles).filter(
    (k) => !hasChangelog(filteredFiles[k].files, pattern),
  );
  const changelogPaths = await getChangelogPaths(missingChangelogs, pattern);

  // TODO: spruce this up
  const plural = changelogPaths.length > 1;
  console.log(
    kleur.bold(
      `${changelogPaths.length} changelog update${plural ? 's' : ''} appear${
        plural ? '' : 's'
      } to be missing in this commit:\n`,
    ),
  );
  changelogPaths.forEach((file, idx) => {
    console.log(` ${kleur.gray(`[${idx + 1}/${changelogPaths.length}]`)} ${file}`);
  });
  const update = await question(`\nWould you like to update ${plural ? 'them' : 'it'} now? [Y/n] `);

  if (update.toLowerCase() === 'n') {
    process.exit(0);
  }

  const notify = (p) => {
    console.clear();
    console.log(kleur.gray(kleur.bold(`Creating a new changelog entry.`)));
    console.log(
      `${kleur.gray('Find out more about how to write entires in')} ${kleur.gray(
        kleur.bold('updoot'),
      )} ${kleur.cyan(kleur.underline('https://github.com/Renddslow/updoot#entries'))}`,
    );
    console.log(
      kleur.gray(
        `Type ${kleur.bold(':done')} or ${kleur.bold(
          ':x',
        )} anywhere to move to the next Changelog\n`,
      ),
    );
    console.log(`[ ${kleur.gray('Editing')} ] ${kleur.bold(p)}`);
  };

  /**/
  let currentPath = changelogPaths.shift();
  const changelogs = {
    [currentPath]: [],
  };

  notify(currentPath);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '',
  });

  rl.write('\n');
  rl.prompt(false);

  for await (const line of rl) {
    if (line.includes(':x') || line.includes(':done')) {
      const l =
        line.trim() !== ':x' || line.trim() !== ':done' ? line.replace(/:(x|done)/g, '') : false;
      if (l) {
        changelogs[currentPath].push(l);
      }

      currentPath = changelogPaths.shift();

      if (currentPath) {
        console.clear();
        notify(currentPath);
        changelogs[currentPath] = [];
        rl.write('\n');
      } else {
        rl.close();
      }
    } else {
      changelogs[currentPath].push(line);
    }
  }

  console.clear();
  const spinner = ora('Merging and saving changelogs...').start();

  console.log(changelogs);
  await Promise.all(
    Object.keys(changelogs).map(async (k) => {
      const content = (await read(k)).toString();
      console.log(content);
    }),
  );

  spinner.stop();
};
