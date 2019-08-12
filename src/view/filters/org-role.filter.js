import { ORG_ROLE_LABEL } from '@/core/constants/role';

export default function orgRoleFilter(role) {
  return ORG_ROLE_LABEL[role];
}
