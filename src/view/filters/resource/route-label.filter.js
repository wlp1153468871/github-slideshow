import { get } from 'lodash';
import isWebRouteFilter from '@/view/filters/resource/is-web-route.filter';
import routeHostFilter from '@/view/filters/resource/route-host.filter';
import routeWebURLFilter from '@/view/filters/resource/route-web-url.filter';

const getSubdomain = route => {
  const hostname = get(route, 'spec.host', '');
  return hostname.replace(/^[a-z0-9]([-a-z0-9]*[a-z0-9])\./, '');
};

export default function routeLabelFilter(route, host, omitPath) {
  if (isWebRouteFilter(route)) {
    return routeWebURLFilter(route, host, omitPath);
  }

  let label = host || routeHostFilter(route);
  if (!label) {
    return '<unknown host>';
  }

  if (get(route, 'spec.wildcardPolicy') === 'Subdomain') {
    label = `*.${getSubdomain(route)}`;
  }

  if (omitPath) {
    return label;
  }

  if (route.spec.path) {
    label += route.spec.path;
  }
  return label;
}
