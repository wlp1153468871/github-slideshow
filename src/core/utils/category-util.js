import getDeployPath from '@/view/router/util/deploy-map';
import getRoutePath from '@/view/router/util/router-map';

const mapRouter = services => {
  return services.map(service => {
    return {
      ...service,
      route: getRoutePath(service),
      deployRoute: getDeployPath(service),
    };
  });
};

/**
 * transfer category map to array
 * @param {*} categoryMap
 */
function map2Array(categoryMap) {
  const result = [];
  Object.entries(categoryMap).forEach(([name, services]) => {
    if (Array.isArray(services)) {
      result.push({ name, services: mapRouter(services) });
    } else {
      result.push({ name, children: map2Array(services) });
    }
  });
  return result;
}

function map2FilterArray(categoryMap) {
  const result = [];
  Object.entries(categoryMap).forEach(([name, services]) => {
    if (Array.isArray(services)) {
      if (services.length) {
        result.push({ name, services: mapRouter(services) });
      }
    } else {
      const children = map2FilterArray(services);
      if (children.length) {
        result.push({ name, children });
      }
    }
  });
  return result;
}

/**
 * transfer category array to map
 * @param {*} categoryArray
 */
function array2Map(categoryArray) {
  const result = {};
  categoryArray.forEach(({ name, services, children }) => {
    if (services) {
      result[name] = services.map(s => s.id);
    }
    if (children) {
      result[name] = array2Map(children);
    }
  });
  return result;
}

export default { map2Array, array2Map, map2FilterArray };
