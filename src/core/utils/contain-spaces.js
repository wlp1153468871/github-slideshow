export default function containSpaces(value) {
  const pathRegex = /\s/g;
  return pathRegex.test(value);
}
