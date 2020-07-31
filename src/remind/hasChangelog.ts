import multimatch from 'multimatch';

export default (files: Array<string>, pattern: string = 'changelog*') => {
  const matched = multimatch(files, pattern, { nocase: true });
  return !!matched.length;
};
