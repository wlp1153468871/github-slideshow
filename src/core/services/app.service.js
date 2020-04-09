import { toPairs, pick } from 'lodash';
import URL from 'url-parse';

import InstanceService from './instance.service';
import { APIService } from './api';
import AuthInterceptor from './api/auth.interceptor';

class AppService {
  constructor() {
    this.api = new APIService('', pick(AuthInterceptor, ['response', 'request']));
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
    return this.api.get(
      `/app-server/api/v1/zones/${zoneId}/namespaces/${namespace}/pods/${podName}/containers/${applicationName}/log/page`,
      query,
    );
  }

  listOnlinePodLogs(zoneId, namespace, podName, applicationName) {
    return `ws://${window.location.host}/api/v1/zones/${zoneId}/namespaces/${namespace}/pods/${podName}/containers/${applicationName}/log`;
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
