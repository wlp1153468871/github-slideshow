import routeHostFilter from '@/view/filters/resource/route-host.filter';

export default function routeWebUrlFilter(route, host, omitPath) {
  const scheme =
    route.spec.tls && route.spec.tls.tlsTerminationType !== ''
      ? 'https'
      : 'http';
  let url = `${scheme}://${host || routeHostFilter(route)}`;
  if (route.spec.path && !omitPath) {
    url += route.spec.path;
  }
  return url;
}
