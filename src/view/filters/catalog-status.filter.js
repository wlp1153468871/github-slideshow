import { CATALOG_STATUS } from '@/core/constants/constants';

const { AVAILABLE, UNINSTALL, INSTALLUNAVAILABLE, UNKNOWN } = CATALOG_STATUS;

export default function catalogStatus(status) {
  const statusMap = {
    [AVAILABLE]: '可用区可用',
    [UNINSTALL]: '当前可用区没有安装 service catalog，请参考官方文档手动安装。',
    [INSTALLUNAVAILABLE]: '当前可用区的 service catalog 异常，请联系相应的服务提供商。',
    [UNKNOWN]: '当前可用区的 service catalog 状态未知。',
  };

  return statusMap[status];
}
