const detailMap = {
  dashboard_url: '控制台地址',
  database: '数据库',
  deploy_password: '发布密码',
  deploy_url: '发布地址',
  deploy_user: '发布用户名',
  externalHost: '外部主机',
  externalPort: '外部端口',
  host: '主机',
  organization_name: '组织名',
  port: '端口',
  password: '密码',
  registry_domain: '镜像仓库地址',
  registry_password: '镜像仓库密码',
  registry_user: '镜像仓库用户名',
  uri: '连接地址',
  username: '用户名',
  clustersize: '实例数',
};

export default function InstanceDetailFilter(name) {
  return detailMap[name] || name;
}
