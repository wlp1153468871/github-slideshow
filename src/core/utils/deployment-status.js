import { INSTANCE_STATUS } from '@/core/constants/constants';

const { CREATING, CREATE_FAILED, APPROVING, PROCESS_REJECTED } = INSTANCE_STATUS;

export default function deploymentStatus(status) {
  const statusMap = {
    [CREATING]: '正在创建',
    [CREATE_FAILED]: '创建失败',
    [APPROVING]: '正在审批',
    [PROCESS_REJECTED]: '审批失败',
  };

  return statusMap[status] || '使用中';
}
