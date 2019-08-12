import { SERVICE_TYPES } from '@/core/constants/constants';

const typeMap = {
  [SERVICE_TYPES.AUTOMATIC_SERVICE]: '自动服务',
  [SERVICE_TYPES.MANUAL_SERVICE]: '主动服务',
  [SERVICE_TYPES.APPLICATION_SERVICE]: '应用服务',
};

export default function serviceTypeFilter(type) {
  return typeMap[type];
}
