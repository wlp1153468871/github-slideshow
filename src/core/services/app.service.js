import { toPairs } from 'lodash';
import URL from 'url-parse';

import InstanceService from './instance.service';
import api from './api';

class AppService {
  constructor() {
    this.api = api;
  }

  updateAppParameters(instanceId, params, action = {}) {
    const { id = 'update', name = '更新' } = action;
    return InstanceService.executeActions(instanceId, {
      id,
      name,
      params,
    });
  }

  updateApp(instanceId, params) {
    return InstanceService.doInstanceUpdate(instanceId, params);
  }

  listAllPodLogs(zoneId, namespace, applicationName, applicationId, offset = {}) {
    offset.applicationid = applicationId;
    return this.listPodLogs(zoneId, namespace, '_all', applicationName, offset);
  }

  listPodLogs(zoneId, namespace, podName, applicationName, query = {}) {
    return this.api.get(`/spaces/${namespace}/pods/${podName}/log/page`, {
      zone: zoneId,
      ...query,
    });
  }

  downloadLog(space, pod, query) {
    return this.api
      .get(`/spaces/${space}/pods/${pod}/log/download`, query, {
        responseType: 'blob',
      })
      .then(res => {
        return new Blob([res], { type: 'text/plain' });
      });
  }

  listOnlinePodLogs(zoneId, namespace, podName, applicationName) {
    return `ws://${
      window.location.host
    }/api/v1/zones/${zoneId}/namespaces/${namespace}/pods/${podName}/containers/${applicationName}/log`;
  }

  openTerminal(namespace = '', pod = '') {
    const features = toPairs({
      width: 900,
      height: 600,
      location: 'no',
      locationbar: 'no',
    })
      .map(x => x.join('='))
      .join(',');

    const parsed = URL('./terminal.html');
    parsed.set('query', {
      namespace,
      pod,
    });

    window.open(
      parsed.toString(), // url
      'DescriptiveWindowName', // window name
      features, // window option
    );
  }
}

export default new AppService();
