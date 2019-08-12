export default function isAnnotationName(name) {
  const regex = /^([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]$/;
  return name.length < 63 && regex.test(name);
}
