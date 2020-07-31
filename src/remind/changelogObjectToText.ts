import { Changelog } from './changelogTextToObject';

const SORT_ORDER = {
  added: 0,
  changed: 1,
  deprecated: 2,
  removed: 3,
  fixed: 4,
  security: 5,
};

const capitalize = (w: string): string => `${w[0].toUpperCase()}${w.slice(1)}`;
const header = (level: 1 | 2 | 3 | 4 | 5 | 6): string => Array(level).fill('#').join('');
const bullets = (arr: Array<string>) => arr.map((a) => `- ${a}`);

export default (content: Changelog, preserveEmpties: boolean = true): string => {
  const tree = Object.keys(content)
    .map((k) => ({ type: k, ...content[k] }))
    .sort((a, b) => {
      if (SORT_ORDER[a.type] > SORT_ORDER[b.type]) return 1;
      if (SORT_ORDER[b.type] > SORT_ORDER[a.type]) return -1;
      return 0;
    });

  return (
    tree
      .reduce((acc, { type, level, changes }) => {
        acc += `\n\n`;

        if (!preserveEmpties && !changes.length) return acc;

        const str = [`${header(level)} ${capitalize(type)}\n`, ...bullets(changes)];
        acc += str.join('\n');
        return acc;
      }, '')
      .trim() + '\n'
  );
};
