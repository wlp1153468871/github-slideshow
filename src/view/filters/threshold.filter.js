export default function thresholdFilter(key) {
  switch (key) {
    case '>':
      return '大于';
    case '<':
      return '小于';
    case '==':
      return '等于';
    case '!=':
      return '不等于';
    default:
      return '大于';
  }
}
