import qs from 'qs';
import pathToRegExp from 'path-to-regexp';

const url = {}

/**
 * 获取url参数
 * @param key  参数名
 * @param defaultValue 默认值
 * @returns {null}
 */
url.query = (key, defaultValue) => {
  const arr = window.location.href.split('?')
  const res = defaultValue ? defaultValue : null;
  if (arr.length <= 1) {
    return res;
  }
  const obj = qs.parse(arr[1])
  return obj[key] === undefined ? res : obj[key];
};

/**
 * 匹配url
 * @param rule
 * @param pathname
 * @returns {Array|{index: number, input: string}}
 */
url.match = (rule, pathname) => {
  const match = pathToRegExp(rule).exec(pathname);
  return match;
};

export default url;
