import { APIService } from './api/index';
import { BrokerModel } from '../models';
import api from './api';

class BrokerService {
  api: APIService;

  constructor() {
    this.api = api;
  }

  addBroker(zoneId: string, broker: BrokerModel) {
    return this.api.post(`/zones/${zoneId}/brokers`, broker);
  }

  removeBroker(zoneId: string, brokerId: string) {
    return this.api.delete(`/zones/${zoneId}/brokers/${brokerId}`);
  }

  isDeletable(zoneId: string, brokerId: string) {
    return this.api.get(`/zone/${zoneId}/brokers/${brokerId}/describe`);
  }

  syncBroker(zoneId: string, brokerId: string) {
    return this.api.post(`/zones/${zoneId}/brokers/${brokerId}/broker_service`);
  }

  getBrokerLogs(zoneId: string, brokerId: string) {
    return this.api.get(
      `/zones/${zoneId}/brokers/${brokerId}/broker-service/sync_log`,
    );
  }
}

export default new BrokerService();
