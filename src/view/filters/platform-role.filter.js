import { PLATFORM_ROLE_LABEL } from '@/core/constants/role';

export default function platformRoleFilter(value) {
  return PLATFORM_ROLE_LABEL[value];
}
