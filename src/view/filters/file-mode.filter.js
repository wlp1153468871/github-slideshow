export default function configFileFilter(mode) {
  if (mode) {
    return '读写';
  }
  return '只读';
}
