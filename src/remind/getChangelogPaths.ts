import globby from 'globby';

export default (paths: Array<string>, pattern: string) => {
  return globby(
    paths.map((p) => `${p}/${pattern}`),
    { caseSensitiveMatch: false },
  );
};
