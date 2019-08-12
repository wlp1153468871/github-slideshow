<template>
  <div class="container">
    <dao-setting-layout>
      <template slot="layout-title">确认订购</template>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">项目信息</div>
          <div slot="content">
            租户：{{ org.name }}，项目：{{ space.name }}
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">区域 / 环境</div>
          <div slot="content">{{ zone.area_name }} / {{ zone.env_name }}</div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">名称</div>
          <div slot="content">{{ configName }}</div>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>
  </div>
</template>

<script>
export default {
  name: 'OverviewPanel',
  props: {
    org: { type: Object, default: () => ({}) },
    space: { type: Object, default: () => ({}) },
    zone: { type: Object, default: () => ({}) },
    configName: { type: String, default: '' },
  },
};
</script>
