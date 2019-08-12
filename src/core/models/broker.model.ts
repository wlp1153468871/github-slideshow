export interface BrokerModel {
  name: string;
  url: string;
  userName?: string;
  password?: string;
  token?: string;
  id?: string;
  available?: boolean;
  [propName: string]: any;
}
