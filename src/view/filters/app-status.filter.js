import { APPROVAL_PROCESS_TYPES as APPROVE } from '@/core/constants/constants';

const statusMap = {
  'create.building_image': '构建中',
  'create.built_image_success_and_building_dce_app': '构建中',
  'create.built_dce_app_error': '构建失败',
  'create.built_image_error': '构建失败',
  'create.built_dce_app_success_and_running': '运行中',
  'create.building_dce_app': '构建中',
  'update.built_image_error': '运行中',
  'update.updated_dce_app_success_and_running': '运行中',
  'ops.restarting': '启动中',
  'ops.restarted_success_and_running': '运行中',
  'ops.starting': '启动中',
  'ops.started_error': '启动失败',
  'ops.started_success_and_running': '运行中',
  'ops.pause_running': '运行中',
  'ops.pause': '已停止',
  'ops.pause_error_and_running': '运行中',
  'ops.deleted_error_and_running': '删除失败',
  [APPROVE.APPROVING]: '正在审批中',
  [APPROVE.PROCESS_PENDING]: '正在审批中',
  [APPROVE.PROCESS_ONDOING]: '正在审批中',
  [APPROVE.PROCESS_DONE]: '审批通过',
  [APPROVE.PROCESS_REJECTED]: '审批拒绝',
};

export default function appStatusFilter(status) {
  return statusMap[status] || '';
}
