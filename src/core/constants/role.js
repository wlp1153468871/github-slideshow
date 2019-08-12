export const PLATFORM_ROLE = {
  ADMIN: 'platform_admin',
  MEMBER: 'platform_member',
};

export const PLATFORM_ROLE_LABEL = {
  [PLATFORM_ROLE.ADMIN]: '平台管理员',
  [PLATFORM_ROLE.MEMBER]: '平台普通用户',
};

export const ORG_ROLE = {
  ADMIN: 'organization_admin',
  MEMBER: 'organization_member',
};

export const ORG_ROLE_LABEL = {
  [ORG_ROLE.ADMIN]: '租户管理员',
  [ORG_ROLE.MEMBER]: '租户普通用户',
};

export const SPACE_ROLE = {
  ADMIN: 'space_admin',
  MEMBER: 'space_member',
};

export const SPACE_ROLE_LABEL = {
  [SPACE_ROLE.ADMIN]: '项目组管理员',
  [SPACE_ROLE.MEMBER]: '项目组普通用户',
};

export const ZONE_ROLE = {
  ADMIN: 'zone_admin',
  EDIT: 'zone_edit',
  VIEW: 'zone_viewer',
  UNAUTHORIZED: 'zone_unauthorized',
};

export const ZONE_ROLE_LABEL = {
  [ZONE_ROLE.ADMIN]: '管理员',
  [ZONE_ROLE.EDIT]: '可编辑',
  [ZONE_ROLE.VIEW]: '仅查看',
  [ZONE_ROLE.UNAUTHORIZED]: '未授权',
};
