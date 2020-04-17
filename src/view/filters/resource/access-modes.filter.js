import { uniq } from 'lodash';

export default function accessModesFilter(value, format) {
  if (!value) {
    return value;
  }
  const accessModes = [];
  value.forEach(item => {
    let accessModeString;
    const longForm = format === 'long';
    switch (item) {
      case 'ReadWriteOnce':
        accessModeString = longForm ? '读写(独占) (Read-Write-Once)' : '读写(独占)';
        break;
      case 'ReadWriteMany':
        accessModeString = longForm ? '读写(共享) (Read-Only-Many)' : '读写(共享)';
        break;
      case 'ReadOnlyMany':
        accessModeString = longForm ? '只读(共享) (Read-Write-Many)' : '只读(共享)';
        break;
      default:
        accessModeString = item;
    }
    accessModes.push(accessModeString);
  });
  return uniq(accessModes).join();
}
