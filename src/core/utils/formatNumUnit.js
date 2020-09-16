import { toNumber } from 'lodash';

function formatNumUnit(size) {
  const units = [
    // 顺序不能乱！！！
    // 修正因为单位修改后 K 比 Ki 先识别出来，导致单位是 Ki 的情况下，数据变为 0 的情况
    ['EB', 1000 ** 6],
    ['PB', 1000 ** 5],
    ['TB', 1000 ** 4],
    ['GB', 1000 ** 3],
    ['MB', 1000 * 1000],
    ['KB', 1000],
    ['Bytes', 1],
    ['Ei', 1024 ** 6],
    ['Pi', 1024 ** 5],
    ['Ti', 1024 ** 4],
    ['Gi', 1024 ** 3],
    ['Mi', 1024 * 1024],
    ['Ki', 1024],
    ['E', 1024 ** 6],
    ['P', 1024 ** 5],
    ['T', 1024 ** 4],
    ['G', 1024 ** 3],
    ['M', 1024 * 1024],
    ['K', 1024],
    ['m', 1 / 1000],
    ['k', 1000],
    ['B', 1],
  ];
  let unitIndex = -1;
  units.forEach(([key], i) => {
    if (size.toString().indexOf(key) > -1) {
      unitIndex = i;
      return false;
    }
    return true;
  });

  if (unitIndex >= 0) {
    const result = toNumber(size.replace(units[unitIndex][0], '') * units[unitIndex][1]) || 0;
    return toNumber(result.toFixed(3));
  }
  return toNumber(size);
}

export default formatNumUnit;
