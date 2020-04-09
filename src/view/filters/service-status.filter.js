import { SERVICE_STATUS } from '@/core/constants/constants';

const { AVAILABLE, UNAVAILABLE, BROKERDELETED } = SERVICE_STATUS; // INSTANCE_STATUS

export default function serviceStatus(status) {
  const statusMap = {
    // *-ing
    [AVAILABLE]: '已上架',
    [UNAVAILABLE]: '已下架',
    [BROKERDELETED]: '禁用',
  };

  return statusMap[status] || '已上架';
}
