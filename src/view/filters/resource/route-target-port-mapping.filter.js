import { find, get as getValue, isString } from 'lodash';

const portDisplayValue = (servicePort, containerPort, protocol) => {
  servicePort = servicePort || '<unknown>';
  containerPort = containerPort || '<unknown>';

  // \u2192 is a right arrow (see examples below)
  let mapping = `Service Port ${servicePort} \u2192 Container Port ${containerPort}`;
  if (protocol) {
    mapping += ` (${protocol})`;
  }

  return mapping;
};

const getServicePortForRoute = (targetPort, service) => {
  return find(service.spec.ports, servicePort => {
    if (isString(targetPort)) {
      // When using a named port in the route target port, it refers to the service port.
      return servicePort.name === targetPort;
    }

    // Otherwise it refers to the container port (the service target port).
    // If service target port is a string, we won't be able to correlate the route port.
    return servicePort.targetPort === targetPort;
  });
};

// Returns a display value for a route target port that includes the
// service port, e.g.
//   Service Port 8080 -> Container Port 8081
// If no target port for the route or service is undefined, returns an
// empty string.
// If the corresponding port is not found, returns
//   Service Port <unknown> -> Container Port 8081
// or
//   Service Port web -> Container Port <unknown>
export default function routeTargetPortMappingFilter(route, service) {
  if (!route.spec.port || !route.spec.port.targetPort || !service) {
    return '';
  }

  const targetPort = getValue(route.spec.port, 'targetPort');
  // Find the corresponding service port.
  const servicePort = getServicePortForRoute(targetPort, service);
  if (!servicePort) {
    // Named ports refer to the service port name.
    if (isString(targetPort)) {
      return portDisplayValue(targetPort, null);
    }

    // Numbers refer to the container port.
    return portDisplayValue(null, targetPort);
  }

  return portDisplayValue(
    servicePort.port,
    servicePort.targetPort,
    servicePort.protocol,
  );
}
