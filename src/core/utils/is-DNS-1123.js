export default function isDNS1123(name) {
  const regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
  return name.length < 253 && regex.test(name);
}
