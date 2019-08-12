import api from './api';
import Rest from './api/rest';

class ResourceTemplateService {
  api: Rest;

  constructor() {
    this.api = api.create('./workloads', {});
    this.configInterceptors();
  }

  configInterceptors() {
    this.api.rest.interceptors.response.use((res: any) => {
      if (/^20\d/.test(res.status)) {
        return res.data;
      }
      return res;
    });
  }

  getTemplate(type: string) {
    return this.api.get(`/${type}.json`);
  }
}

export default new ResourceTemplateService();
