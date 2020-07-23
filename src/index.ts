#!usr/bin/env node
'use strict';
import sade from 'sade';
import pkgUp from 'pkg-up';

(async function () {
  const prog = sade('updoot');

  console.log(await pkgUp({ cwd: __dirname }));

  prog.version('');
})();
