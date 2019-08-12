import { ZONE_ROLE_LABEL } from '@/core/constants/role';

export default function zoneAuthFilter(zoneRoles = []) {
  return zoneRoles
    .map(({ zone_name, zone_role }) =>
      `${zone_name} : ${ZONE_ROLE_LABEL[zone_role]}`)
    .join('，');
}
