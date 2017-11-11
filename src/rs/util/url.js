import qs from 'qs';

const url = {}

url.query = (key) => {
  const arr = window.location.href.split('?')
  if (arr.length <= 1) {
    return null;
  }
  const obj = qs.parse(arr[1])
  return obj[key] === undefined ? null : obj[key];
};

export default url;