// TODO : 待完善

import { RESOURCE_TYPE } from '@/core/constants/resource';

const dict = {
  name: '名称',
  hostname: '访问域名',
  targetPort: '目标端口',
  [RESOURCE_TYPE.APPLICATION]: '应用',
};

export default function translateFilter(key) {
  return dict[key] || key;
}
