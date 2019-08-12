import store from '@/core/store';
import api from './api';

/**
 * @kind api.service
 */
class ApprovalService {
  constructor() {
    this.api = api;
  }

  get spaceId() {
    return store.getters.spaceId;
  }

  get zoneId() {
    return store.getters.zoneId;
  }

  /**
   * 获取需要当前登录用户审批的 approvals
   */
  listApprovals() {
    return this.api.get('/user/approvals');
  }

  /**
   * 获取需要当前登录用户审批的 approvals
   */
  getApproval(approvalId) {
    return this.api.get(`/approvals/${approvalId}`);
  }

  /**
   * 修改审批记录为'同意'或者'拒绝'
   * @param {String} approvalId 审批记录ID
   * @param {String} processStatus 审批记录的状态
   */
  update(approvalId, processStatus) {
    return this.api.put(`/approvals/${approvalId}`, {
      approval_id: approvalId,
      process_status: processStatus,
    });
  }

  /**
   * 撤销 审批记录
   * @param {String} approvalId 审批记录 ID
   */
  withdrawal(approvalId) {
    return this.api.delete(`/approvals/${approvalId}`, {
      approval_id: approvalId,
    });
  }

  /**
   * 获取用户的历史记录
   * @param {String} spaceId 租户ID
   */
  history(spaceId) {
    return this.api.get(`/spaces/${spaceId}/approval_logs`);
  }

  /**
   * 获取当前租户的审批配置
   * @param {String} spaceId 租户ID
   * @param zone
   */
  getConfig(spaceId, zone = this.zoneId) {
    return this.api.get(`/spaces/${spaceId}/approval_config`, { zone });
  }

  /**
   * 设置当前租户的审批配置
   * @param {String} spaceId
   * @param data
   * @param zone
   *  config.is_need_approval {Boolean}
   *  config.approval_type [
   *    'pass_type_allof',
   *    'pass_type_anyof',
   *    'pass_type_seq',
   *    'pass_type_custom',
   * ]
   */
  setConfig(spaceId, data, zone = this.zoneId) {
    return this.api.post(`/spaces/${spaceId}/approval_config`, data, {
      params: { zone },
    });
  }
}

export default new ApprovalService();
