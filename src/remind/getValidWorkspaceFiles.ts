import multimatch from 'multimatch';

interface PkgRecord {
  name: string;
  files: Array<string>;
}

const getPackageName = (file: string, workspaces: Array<string>) => {
  const segmentsToStar = workspaces.map((w) => {
    const segments = w.split('/');
    return {
      workspace: w,
      idx: segments.findIndex((s) => s === '*'),
    };
  });

  const fileSegments = file.split('/');

  for (const segment of segmentsToStar) {
    if (multimatch(fileSegments.slice(0, segment.idx + 1).join('/'), segment.workspace).length) {
      return {
        name: fileSegments[segment.idx],
        path: segment.workspace.replace('*', fileSegments[segment.idx]),
      };
    }
  }

  return null;
};

export default (
  files: Array<string>,
  workspaces: Array<string>,
  ignored: Array<string>,
): Record<string, PkgRecord> => {
  return files.reduce((acc, val) => {
    const pkg = getPackageName(val, workspaces);

    if (!pkg || ignored.includes(pkg.name)) return acc;

    if (!acc[pkg.path]) {
      acc[pkg.path] = {
        name: pkg.name,
        files: [],
      };
    }

    acc[pkg.path].files.push(val);
    return acc;
  }, {});
};
