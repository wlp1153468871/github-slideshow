/**
 * http://www.inwap.com/pdp10/ansicode.txt
 * stdout 中常见的控制字符有
 * [1A
 * [2K
 * [1B
 * 替换建议: 替换成空字符串
 */
export default function clearCtrlChars(str) {
  return str.replace(/\[1A|\[2K|\[1B/g, '');
}
