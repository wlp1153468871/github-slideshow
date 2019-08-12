import { BrokerService } from '@/core/models/broker-service.model';

export interface Broker {
  id: string;
  name: string;
  url: string;
  brokerService?: BrokerService[];
}
