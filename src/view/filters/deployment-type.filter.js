export default function deploymentTypeFilter(type) {
  if (type === 'blue-green-release') return '按百分比';
  else if (type === 'gray-release') return '按规则';
  return '默认';
}
