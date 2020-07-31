import remarkParse from 'remark-parse';
import { get } from 'dot-prop';

export interface Changelog {
  added?: ChangelogSection;
  changed?: ChangelogSection;
  deprecated?: ChangelogSection;
  removed?: ChangelogSection;
  fixed?: ChangelogSection;
  security?: ChangelogSection;
}

interface ChangelogSection {
  headerLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  changes: Array<string>;
}

export interface RemarkNode {
  type: string;
  depth?: number;
  children?: Array<RemarkNode>;
  position: Record<string, any>;
}

export default (text: string): Changelog => {
  // @ts-ignore
  const parser = new remarkParse.Parser(null, text);
  const document = parser.parse();

  return (<Array<RemarkNode>>document.children)
    .reduce((acc, val) => {
      if (val.type === 'heading') {
        const expectedHeaderKey = get(val, `children.0.value`, '').toLowerCase();
        acc.push({
          key: expectedHeaderKey,
          changes: [],
          level: val.depth || 0,
        });
      }

      if (val.type === 'list') {
        acc[acc.length - 1].changes.push(
          ...val.children.reduce((acc, { children, type }) => {
            if (type !== 'listItem') return acc;
            acc.push(get(children, `0.children.0.value`));
            return acc;
          }, []),
        );
      }

      return acc;
    }, [])
    .reduce((acc, val) => {
      const { changes, key, level } = val;
      acc[key] = { changes, level };
      return acc;
    }, {});
};
