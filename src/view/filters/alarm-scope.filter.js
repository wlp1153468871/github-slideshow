export default function (val) {
  switch (val) {
    case 'container':
      return '容器';
    case 'app':
      return '应用';
    case 'service':
      return '服务';
    default:
      return '';
  }
}
