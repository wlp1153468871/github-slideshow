import {
  isString,
  each,
  size,
  get,
  find,
  groupBy,
  orderBy,
  some,
  isEmpty,
} from 'lodash';

export default class RoutesService {
  constructor(route, services) {
    this.route = route;
    this.services = services;
  }

  isPortNamed(port) {
    return isString(port);
  }

  getServicePortForRoute(targetPort, service) {
    return find(service.spec.ports, servicePort => {
      if (this.isPortNamed(targetPort)) {
        // When using a named port in the route target port, it refers to the service port.
        return servicePort.name === targetPort;
      }

      // Otherwise it refers to the container port (the service target port).
      // If service target port is a string, we won't be able to correlate the route port.
      return servicePort.targetPort === targetPort;
    });
  }

  getRouteWarnings(route, services) {
    const warnings = [];

    if (!route) {
      return warnings;
    }

    this.addRouteTargetWarnings(route, route.spec.to, services, warnings);

    each(route.spec.alternateBackends, alternateBackend => {
      this.addRouteTargetWarnings(route, alternateBackend, services, warnings);
    });

    this.addTLSWarnings(route, warnings);

    this.addIngressWarnings(route, warnings);

    return warnings;
  }

  addRouteTargetWarnings(route, target, services, warnings) {
    if (target.kind !== 'Service') {
      return;
    }

    const service = get(services, [target.name]);
    // Has the service been deleted?
    if (!service) {
      warnings.push(`Routes to service "${target.name}", but service does not exist.`);
      return;
    }

    const targetPort = route.spec.port ? route.spec.port.targetPort : null;
    if (!targetPort) {
      if (size(service.spec.ports) > 1) {
        warnings.push(`Route has no target port, but service "${
          service.metadata.name
        }" has multiple ports. ` +
            'The route will round robin traffic across all exposed ports on the service.');
      }

      // Nothing else to check.
      return;
    }

    // Warn when service doesn't have a port that matches target port.
    const servicePort = this.getServicePortForRoute(targetPort, service);

    if (!servicePort) {
      if (this.isPortNamed(targetPort)) {
        warnings.push(`Route target port is set to "${targetPort}", but service "${
          service.metadata.name
        }" has no port with that name.`);
      } else {
        warnings.push(`Route target port is set to "${targetPort}", but service "${
          service.metadata.name
        }" does not expose that port.`);
      }
    }
  }

  addTLSWarnings(route, warnings) {
    if (!route.spec.tls) {
      return;
    }

    if (!route.spec.tls.termination) {
      warnings.push('Route has a TLS configuration, but no TLS termination type is specified. TLS will not be enabled until a termination type is set.');
    }

    if (route.spec.tls.termination === 'passthrough' && route.spec.path) {
      warnings.push(`Route path "${
        route.spec.path
      }" will be ignored since the route uses passthrough termination.`);
    }
  }

  addIngressWarnings(route, warnings) {
    const wildcardPolicy = get(route, 'spec.wildcardPolicy');
    route.status.ingress.forEach(ingress => {
      const condition = find(ingress.conditions, {
        type: 'Admitted',
        status: 'False',
      });
      if (condition) {
        let message = `Requested host ${ingress.host ||
          '<unknown host>'} was rejected by the router.`;
        if (condition.message || condition.reason) {
          message += ` Reason: ${condition.message || condition.reason}.`;
        }
        warnings.push(message);
      }

      // This message only displays with old router images that are not aware of `wildcardPolicy`.
      if (
        !condition &&
        wildcardPolicy === 'Subdomain' &&
        ingress.wildcardPolicy !== wildcardPolicy
      ) {
        warnings.push(`Router "${
          ingress.routerName
        }" does not support wildcard subdomains. Your route will only be available at host ${
          ingress.host
        }.`);
      }
    });
  }

  isAdmitted(route) {
    // Consider the route admitted if any ingress has any condition matching
    // { type: 'Admitted', status: 'True' }
    return some(route.status.ingress, ingress => {
      return some(ingress.conditions, {
        type: 'Admitted',
        status: 'True',
      });
    });
  }

  isCustomHost(route) {
    return this.annotation(route, 'openshift.io/host.generated') !== 'true';
  }

  isOverviewAppRoute(route) {
    return (
      this.annotation(
        route,
        'console.alpha.openshift.io/overview-app-route',
      ) === 'true'
    );
  }

  // Gets a score for the route to decide which to show on the overview.
  scoreRoute(route) {
    let score = 0;
    if (this.isOverviewAppRoute(route)) {
      score += 21;
    }

    if (this.isAdmitted(route)) {
      score += 11;
    }

    const alternateBackends = get(route, 'spec.alternateBackends');
    if (!isEmpty(alternateBackends)) {
      score += 5;
    }

    if (this.isCustomHost(route)) {
      score += 3;
    }

    if (route.spec.tls) {
      score += 1;
    }

    return score;
  }

  sortRoutesByScore(routes) {
    return orderBy(routes, [this.scoreRoute], ['desc']);
  }

  // Gets the preferred route to display between two routes
  getPreferredDisplayRoute(lhs, rhs) {
    const leftScore = this.scoreRoute(lhs);
    const rightScore = this.scoreRoute(rhs);
    return rightScore > leftScore ? rhs : lhs;
  }

  groupByServiceAndAlternateBackends(routes) {
    const routesByService = {};
    const addToService = (route, serviceName) => {
      routesByService[serviceName] = routesByService[serviceName] || [];
      routesByService[serviceName].push(route);
    };

    each(routes, route => {
      addToService(route, route.spec.to.name);
      const alternateBackends = get(route, 'spec.alternateBackends', []);
      each(alternateBackends, alternateBackend => {
        if (alternateBackend.kind !== 'Service') {
          return;
        }

        addToService(route, alternateBackend.name);
      });
    });

    return routesByService;
  }

  groupByService(routes, includeAlternateBackends) {
    if (includeAlternateBackends) {
      return this.groupByServiceAndAlternateBackends(routes);
    }

    return groupBy(routes, 'spec.to.name');
  }

  // For host "foo.example.com" return "example.com"
  getSubdomain(route) {
    const hostname = get(route, 'spec.host', '');
    return hostname.replace(/^[a-z0-9]([-a-z0-9]*[a-z0-9])\./, '');
  }
}
