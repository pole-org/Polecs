const lib = {}
/**
 * 默认值替换
 * @param value
 * @param defaultValue
 * @returns {*}
 */
lib.defaultValue = (value, defaultValue) => {
  return value === null || undefined ? defaultValue : value;
}

export default lib;
