import { SPACE_ROLE_LABEL } from '@/core/constants/role';

export default function orgRoleFilter(role) {
  return SPACE_ROLE_LABEL[role];
}
