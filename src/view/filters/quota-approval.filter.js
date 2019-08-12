import { QUOTA_APPROVAL_LABEL } from '@/core/constants/constants';

export default function quotaApprovalFilter(status) {
  return QUOTA_APPROVAL_LABEL[status];
}
