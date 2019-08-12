import { INSTANCE_STATUS } from '@/core/constants/constants';

const {
  CREATING,
  UPDATING,
  DELETING,
  APPROVING,
  FAILED,
  CREATE_FAILED,
  DELETE_FAILED,
  UPDATE_FAILED,
  PROCESS_REJECTED,
  CREATE_PROCESS_REJECTED,
  STOPPED,
  RUNNING,
} = INSTANCE_STATUS; // INSTANCE_STATUS

export default function instanceStatus(status, defaultStatus = '运行中') {
  const statusMap = {
    // *-ing
    [CREATING]: '正在创建',
    [UPDATING]: '正在更新',
    [DELETING]: '正在删除',
    [APPROVING]: '正在审核中',
    // *-failed
    [FAILED]: '运行失败',
    [CREATE_FAILED]: '创建失败',
    [UPDATE_FAILED]: '更新失败',
    [DELETE_FAILED]: '删除失败',
    [PROCESS_REJECTED]: '审批请求被拒绝',
    [CREATE_PROCESS_REJECTED]: '创建审批请求被拒绝',
    // stoped
    [STOPPED]: '停止运行',
    [RUNNING]: '使用中',
  };

  return statusMap[status] || defaultStatus;
}
