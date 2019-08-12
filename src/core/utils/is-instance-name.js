/**
 * 校验中间件的实例名
 * 只允许输入字母, 数字, '-'，不能以'-'结尾;
 *
 * @param {String} name 应用名
 */
function isInstanceName(name) {
  return /^[a-z]([-a-z0-9]*[a-z0-9])?$/.test(name);
}

export default isInstanceName;
