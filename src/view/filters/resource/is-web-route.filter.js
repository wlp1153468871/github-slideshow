import routeHostFilter from '@/view/filters/resource/route-host.filter';
import { get as getValue } from 'lodash';

export default function isWebRouteFilter(route) {
  return !!routeHostFilter(route, true) && getValue(route, 'spec.wildcardPolicy') !== 'Subdomain';
}
