import api from './api';

class DeploymentConfigResourceService {
  constructor() {
    this.api = api;
  }

  list(spaceId, zone) {
    return this.api.get(`/spaces/${spaceId}/deploymentconfigs`, {
      zone,
    });
  }

  create(spaceId, zone, value) {
    return this.api.post(`/spaces/${spaceId}/deployments`, { value }, {
      params: {
        zone,
      },
    });
  }
}

export default new DeploymentConfigResourceService();
