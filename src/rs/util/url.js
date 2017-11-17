import qs from 'qs';
import pathToRegExp from 'path-to-regexp';

const url = {}

url.query = (key) => {
  const arr = window.location.href.split('?')
  if (arr.length <= 1) {
    return null;
  }
  const obj = qs.parse(arr[1])
  return obj[key] === undefined ? null : obj[key];
};

url.match = (rule, pathname) => {
  const match = pathToRegExp(rule).exec(pathname);
  return match;
};

export default url;
