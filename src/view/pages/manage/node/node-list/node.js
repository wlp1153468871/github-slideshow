// 将获取的数据处理后再渲染到列表中

/**
 * Kubernetes Node Model
 */
import formatNumUnit from '@/core/utils/formatNumUnit';
import conversion from '@/core/utils/conversion';
import { get, chain, toNumber, has } from 'lodash';
import dayjs from 'dayjs';

export default class Node {
  constructor(node) {
    this.nodeInfo = node;
    this.k8sNodeStatus = node.status;
    this.status = this.k8sNodeStatus;
    this.kCreatedTime = dayjs(node.metadata.creationTimestamp).fromNow();

    this.name = node.metadata.name;
    this.hostname = this.name; // alias for property consistency
    this.id = this.name; // alias for property consistency
    this.advertisedIp = chain(this.nodeInfo)
      .get('status.addresses', {})
      .find(v => v.type === 'InternalIP')
      .get('address', '')
      .value();
    this.advertisedAddress = `${this.advertisedIp}:12376`;
    this.cpus = toNumber(node.status.capacity.cpu);
    this.gpus = node.status.capacity['nvidia.com/gpu'] || 0;
    this.labels = node.metadata.labels;
    this.nodeLabels = this.getRolesOptions(node.metadata.labels);
    this.taints = get(this.nodeInfo, 'spec.taints', []);
    this.annotations = node.metadata.annotations;
    this.dockerInfo = {
      OperatingSystem: node.status.nodeInfo.osImage,
      ServerVersion: null,
    };
    this.memory = node.status.capacity.memory;
    this.memoryBytes = formatNumUnit(node.status.capacity.memory);
    this.memoryCapacity = (conversion(get(node, 'status.capacity.memory'), 'Gi')).toFixed(2);
    this.memoryAllocatable = (conversion(get(node, 'status.allocatable.memory'), 'Gi')).toFixed(2);
    this.cpuAllocatable = get(node, 'status.allocatable.cpu');
    this.spec = node.spec;
    this.conditions = get(this.nodeInfo, 'status.conditions', []);
    this.createdAt = dayjs(node.metadata.creationTimestamp);
  }

  getRolesOptions(labels) {
    const isManager = has(labels, 'node-role.kubernetes.io/master');
    const keys = Object.keys(labels);
    const rolesOptions = keys.filter(item => {
      return item.startsWith('node-role.kubernetes.io/');
    });
    if (!isManager) {
      rolesOptions.unshift('node-role.kubernetes.io/worker');
    }
    return this.transNodeRoles(rolesOptions);
  }

  transNodeRoles(roles) {
    const rolesTranslated = [];
    _.forEach(roles, role => {
      [, ...role] = role.split('/');
      switch (role[0]) {
        case 'manager':
        case 'master':
          rolesTranslated.push('控制器');
          break;
        case 'computer':
        case 'worker':
          rolesTranslated.push('容器引擎');
          break;
        case 'registry':
          rolesTranslated.push('镜像仓库');
          break;
        case 'dcei':
          rolesTranslated.push('监控服务器');
          break;
        case 'load-balancer':
          rolesTranslated.push('负载均衡');
          break;
        case 'infrastructure':
          rolesTranslated.push('基础设施');
          break;
        default:
          rolesTranslated.push(role);
      }
    });
    return rolesTranslated.join('， ');
  }
}

