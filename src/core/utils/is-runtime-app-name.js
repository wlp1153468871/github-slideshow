export default function isRuntimeAppName(name) {
  return /^[A-Za-z][A-Za-z0-9\-]{5,26}$/.test(name); // eslint-disable-line
}
