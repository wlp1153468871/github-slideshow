import { INSTANCE_STATUS } from '@/core/constants/constants';

const {
  UPDATE_SUCCESS,
  UPDATE_FAIL,
  COMFIRM_FAIL,
  CONFIRM_SUCCESS,
  CANCEL_SUCCESS,
  CANCEL_FAIL,
} = INSTANCE_STATUS;

export default function deploymentActionStatus(status) {
  const statusMap = {
    [UPDATE_SUCCESS]: '更新成功',
    [UPDATE_FAIL]: '更新失败',
    [COMFIRM_FAIL]: '发布失败',
    [CONFIRM_SUCCESS]: '发布成功',
    [CANCEL_SUCCESS]: '重置成功',
    [CANCEL_FAIL]: '重置失败',
  };

  return statusMap[status] || '无';
}
