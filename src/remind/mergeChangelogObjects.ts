import { Changelog } from './changelogTextToObject';

export default (a: Changelog, b: Changelog): Changelog => {
  const shallowMerge = Object.assign({}, b, a);
  return Object.keys(shallowMerge).reduce((acc, key) => {
    acc[key] = shallowMerge[key];
    console.log(key);
    acc[key].changes = [...(a[key] ? a[key].changes : []), ...(b[key] ? b[key].changes : [])];
    return acc;
  }, {});
};
