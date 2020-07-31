import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { get } from 'dot-prop';

import { RemarkNode } from '../remind/changelogTextToObject';

export default (content: string): string => {
  // @ts-ignore
  const parser = new remarkParse.Parser(null, content);
  const document = parser.parse();

  const unreleasedTree = [];

  let inUnreleasedBlock = false;
  let unreleasedBlockLevel;

  for (const node of <Array<RemarkNode>>document.children) {
    if (node.type === 'heading') {
      if (
        !inUnreleasedBlock &&
        get(node.children, `0.type`) === 'linkReference' &&
        get(node.children, '0.label') === 'Unreleased'
      ) {
        inUnreleasedBlock = true;
        unreleasedBlockLevel = node.depth || 0;
        continue;
      }

      if (unreleasedBlockLevel === node.depth) {
        break;
      }
    }

    if (inUnreleasedBlock) {
      unreleasedTree.push(node);
    }
  }

  console.log(document);

  document.children = unreleasedTree;

  // @ts-ignore
  const stringify = new remarkStringify.Compiler(document);
  return stringify.compile();
};
