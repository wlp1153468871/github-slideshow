export default function hashSizeFilter(hash) {
  if (!hash) {
    return 0;
  }
  return Object.keys(hash).length;
}
