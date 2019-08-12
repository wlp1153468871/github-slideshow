// TODO: 后端兼容
export interface BrokerService {
  synchronized?: boolean; // 是否同步
  available?: boolean; // 是否上架
  [propName: string]: any;
}
