import { isNaN, isFinite } from 'lodash';

const UNITS = ['B', 'K', 'M', 'G', 'T', 'P'];

/**
 * 文件大小单位转换
 * 不足 1K 的以 B 为单位
 * 不足 1M 的以 K 为单位
 * 依次类推
 *
 * 不合法的输入值或单位将返回  '-'
 *
 * @param {String|Number} num - 转换前的数量
 * @param {string} unit - 输入值的单位
 * @param hodor
 */

export default function formatSize(num, unit, hodor = '-') {
  const DEFAULT_STR = hodor;
  const PRECISION = 1;

  unit = unit.toUpperCase();

  if (typeof unit !== 'string') return DEFAULT_STR;
  if (UNITS.indexOf(unit) < 0) return DEFAULT_STR;
  if (isNaN(parseFloat(num)) || !isFinite(num)) return DEFAULT_STR;

  if ((unit === 'B' && num < 1024) || (unit === 'P' && num >= 1)) {
    return `${num}${unit}`;
  }

  const inputUnintIndex = UNITS.indexOf(unit);

  if (num >= 1) {
    const relIndex = Math.floor(Math.log(num) / Math.log(1024));
    const number = (num / (1024 ** Math.floor(relIndex))).toFixed(PRECISION);
    const outputUnit = UNITS[relIndex + inputUnintIndex];
    return `${number}${outputUnit}`;
  }

  const number = (num * 1024).toFixed(PRECISION);
  const outputUnit = UNITS[inputUnintIndex - 1];
  return `${number}${outputUnit}`;
}
