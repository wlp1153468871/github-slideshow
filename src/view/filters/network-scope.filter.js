const NETWORK_SCOPE = {
  local: '本地',
  global: '全局',
  overlay: '虚拟网络',
  bridge: '单机网络',
  swarm: '集群',
  macvlan: 'MAC VLAN',
};

export default function networkScopeFilter(scope) {
  return NETWORK_SCOPE[scope] || scope;
}
