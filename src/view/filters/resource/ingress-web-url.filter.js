export default function ingressWebUrlFilter(ingress, rule, path, omitPath) {
  const scheme = ingress.spec.tls ? 'https' : 'http';
  let url = `${scheme}://${rule.host}`;
  if (path && !omitPath) {
    url += path.path;
  }
  return url;
}
