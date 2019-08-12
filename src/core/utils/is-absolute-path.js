export default function isAbsolutePath(path) {
  const pathRegex = /^(\/([0-9a-zA-Z]+))+(|\/)$/;
  return pathRegex.test(path);
}
