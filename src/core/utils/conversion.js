// 单位间的换算
function conversion(value, oldUnit) {
  const units = ['Bytes', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi'];
  const targetUnit = value.replace(/\d/g, '');
  value = Number(value.replace(/[a-zA-Z]/g, ''));
  if (units.indexOf(targetUnit) === -1 || units.indexOf(oldUnit) === -1) return value;
  const distance = units.indexOf(targetUnit) - units.indexOf(oldUnit);
  // eslint-disable-next-line no-mixed-operators
  return value * 1024 ** distance;
}

export default conversion;
