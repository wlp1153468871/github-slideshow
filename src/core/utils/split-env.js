export default function splitEnv(str, separator = '=') {
  const index = str.indexOf(separator);
  return [
    str.slice(0, index),
    str.slice(index + 1),
  ];
}
