import { Broker } from './broker';

// 后端接口返回
export interface Zone {
  id: string;
  name: string;
  clusterUrl: string;
  status: string;
  createdAt: Date;
  catalogAvailable?: boolean; // 是否有catalog
  syncStatus?: boolean; // 同步状态
  brokers?: Broker[];
  [propName: string]: any;
}
