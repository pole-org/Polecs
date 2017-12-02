const string = {}

/**
 * 检测字符串是否为undefined,null,''
 * @param str
 * @returns {boolean}
 */
string.isNullOrEmpty = (str) => {
  if (str === '' || str === undefined || str === null) {
    return true;
  }
  return false;
}

/**
 * 若字符串检测不通过，以默认值代替
 * @param str
 * @param defaultValue
 * @returns {*}
 */
string.defaultValue = (str, defaultValue) => {
  return string.isNullOrEmpty(str) ? defaultValue : str
}

export default string;
