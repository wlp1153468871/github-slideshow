import store from '@/core/store';
import api from './api';

/**
 * QuotaService 用来管理
 * QuotaGroup 和 QuotaField 2个 model
 */
class QuotaService {
  constructor() {
    this.api = api;
  }

  get zoneId() {
    return store.getters.zoneId;
  }

  // quota_field crud

  listQuotaFields() {
    return this.api.get('/quota_fields');
  }

  /**
   * create QuotaField object
   * @param {QuotaField} quotaField new quotafield object
   * {
   *  "code": "string",
   *  "description": "string",
   *  "name": "string",
   *  "unit": "string"
   * }
   */
  createQuotaField(quotaField) {
    return this.api.post('/quota_fields', quotaField);
  }

  deleteQuotaField(quotaFieldId) {
    return this.api.delete(`/quota_fields/${quotaFieldId}`);
  }

  updateQuotaField(quotaFieldId, quotaField) {
    return this.api.patch(`/quota_fields/${quotaFieldId}`, quotaField);
  }

  // quota_group crud

  listQuotaGroups() {
    return this.api.get('/quota_groups');
  }

  createQuotaGroup(quotaGroup) {
    return this.api.post('/quota_groups', quotaGroup);
  }

  deleteQuotaGroup(quotaGroupId) {
    return this.api.delete(`/quota_groups/${quotaGroupId}`);
  }

  updateQuotaGroup(quotaGroupId, quotaGroup) {
    return this.api.patch(`/quota_groups/${quotaGroupId}`, quotaGroup);
  }

  // organizations/:orgId/quota_groups

  listOrgQuotaGroups(orgId) {
    return this.api.get(`/organizations/${orgId}/quota_groups`);
  }

  createOrgQuotaGroup(orgId, quotaGroup) {
    return this.api.post(`/organizations/${orgId}/quota_groups`, quotaGroup);
  }

  deleteOrgQuotaGroup(orgId, quotaGroupId) {
    return this.api.delete(`/organizations/${orgId}/quota_groups/${quotaGroupId}`);
  }

  updateOrgQuotaGroup(orgId, quotaGroupId, quotaGroup) {
    return this.api.patch(
      `/organizations/${orgId}/quota_groups/${quotaGroupId}`,
      quotaGroup,
    );
  }

  // org used quota_group

  getOrgUsedQuotaGroup(orgId) {
    return this.api.get(`/organizations/${orgId}/organization_quota_groups`);
  }

  updateOrgUsedQuotaGroup(orgId, quotaIds) {
    return this.api.patch(
      `/organizations/${orgId}/organization_quota_groups`,
      quotaIds,
    );
  }

  // space used quota_group

  getSpaceUsedQuotaGroup(spaceId) {
    return this.api.get(`/spaces/${spaceId}/space_quota_groups`);
  }

  updateSpaceUsedQuotaGroup(spaceId, quotaIds) {
    return this.api.patch(`/spaces/${spaceId}/space_quota_groups`, quotaIds);
  }

  // 只获取 租户层级的配额申请
  listOrgQuotaApprovals(organizationId) {
    return this.api.get(`/organizations/${organizationId}/organization_quota_approvals`);
  }

  updateOrgExtendQuota(organizationId, approvalId, quota) {
    return this.api.post(
      `/organizations/${organizationId}/organization_quota_approvals/${approvalId}`,
      quota,
    );
  }

  listSpaceQuotaApprovals(spaceId) {
    return this.api.get(`/spaces/${spaceId}/space_quota_approvals`);
  }

  createSpaceQuotaApproval(spaceId, approval) {
    return this.api.post(`/spaces/${spaceId}/space_quota_approvals`, approval);
  }

  updateSpaceQuotaApproval(spaceId, approvalId, approval) {
    return this.api.patch(
      `/spaces/${spaceId}/space_quota_approvals/${approvalId}`,
      approval,
    );
  }

  addServiceQuota(serviceId, params) {
    return this.api.post(`/services/${serviceId}/quotas`, params);
  }

  deleteServiceQuota(serviceId, quotaId) {
    return this.api.delete(`/services/${serviceId}/quotas/${quotaId}`);
  }
}

export default new QuotaService();
