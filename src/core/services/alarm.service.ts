import api, { APIService } from './api';
import store from '@/core/store';

class AlarmService {
  api: APIService;

  constructor() {
    this.api = api;
  }

  get space(): string {
    return store.getters.spaceId;
  }

  get zone(): string {
    return store.state.zone.id;
  }

  getContainerAtom() {
    return this.api.get(`alert/rules/container`);
  }

  getAppAtom() {
    return this.api.get(`alert/rules/app/jmx`);
  }

  getServiceAtom(serviceName: string) {
    return this.api.get(`alert/rules/service/${serviceName}`);
  }

  getAtomById(metricId: string) {
    return this.api.get(`alert/rules/metrics/${metricId}`);
  }

  getAllAlarmRules() {
    return this.api.get(`space/${this.space}/alert`, { zone: this.zone }, { noNotify: true });
  }

  postRules(rules: object) {
    return this.api.post(`space/${this.space}/alert`, rules, {
      params: { zone: this.zone },
    });
  }

  putAlarmRules(rules: object) {
    return this.api.put(`space/${this.space}/alert`, rules, { params: { zone: this.zone } });
  }

  deleteAlarmRules(ruleId: string) {
    return this.api.delete(`space/${this.space}/alert/${ruleId}`, { zone: this.zone });
  }

  getAllAlarmMetircs() {
    return this.api.get(`alert/rules`);
  }
}

export default new AlarmService();
