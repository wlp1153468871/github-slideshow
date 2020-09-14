<template>
    <div class="system-page">
        <div class="dao-setting-layout">
            <div class="dao-setting-layout-title">
              <div
                class="dao-setting-title capitalize"
              >kubelet 系统信息</div>
            </div>
            <div class="dao-setting-section">
              <div class="dao-setting-item">
                <div class="dao-setting-content">
                  <table class="dao-table row">
                    <tbody>
                      <tr>
                        <td>控制 IP 地址</td>
                        <td>{{ advertisedIp }}</td>
                      </tr>
                      <tr>
                        <td>主机名称</td>
                        <td>{{ node.metadata.name }}</td>
                      </tr>
                      <tr>
                        <td>PodCIDR</td>
                        <td>{{ node.spec.podCIDR }}</td>
                      </tr>
                      <tr>
                        <td>容器组数</td>
                        <td>{{node.status.allocatable.pods }}</td>
                      </tr>
                      <tr>
                        <td>Kubelet 版本</td>
                        <td>{{ node.status.nodeInfo.kubeletVersion }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
    </div>
</template>
<script>
import { chain } from 'lodash';

export default {
  props: {
    node: { type: Object, default: () => {} },
  },
  computed: {
    advertisedIp() {
      return chain(this.node)
        .get('status.addresses', {})
        .find(v => v.type === 'InternalIP')
        .get('address', '')
        .value();
    },
  },
};
</script>
<style scoped>
.dao-table.row tr {
  display: flex;
}
</style>
