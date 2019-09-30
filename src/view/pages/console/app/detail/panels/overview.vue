<template>
  <div class="instance-overview">
    <div class="info-column">
      <!-- 基本信息 -->
      <daox-info-table
        title="基本信息"
        :list="basicInformations">
        <template #self>
          <router-link
            :to="{
              name: 'console.monitor',
              query: { tab: 'app', app: instance.name, id: instance.id },
            }"
            tag="a"
            target="_blank"
          >点击查看</router-link>
        </template>

      </daox-info-table>
    </div>
    <div class="detail-column">
      <daox-info-table title="操作记录">
        <template slot="operation">
          <a
            href="javascript:void(0)"
            @click="gotoJobsTab">
            查看更多 >
          </a>
        </template>
        <template slot="content">
          <event-list :jobs="events"></event-list>
        </template>
      </daox-info-table>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'OverviewPanel',

  props: {
    instance: { type: Object, default: () => ({}) },
    status: { type: String, default: '' },
    events: { type: Array, default: () => [] },
  },

  computed: {
    basicInformations() {
      const {
        owner = {},
        organizationName,
        spaceName,
        name,
        version,
        created_at: createdAt,
        zoneName,
      } = this.instance;
      const unixDate = Vue.filter('unix_date');

      return [
        { name: '租户／项目组', value: `${organizationName}／${spaceName}` },
        { name: '区域／环境', value: zoneName },
        { name: '应用名称', value: name },
        { name: '应用版本', value: version || '无' },
        { name: '创建者', value: owner.name },
        { name: '创建时间', value: unixDate(createdAt) },
        { name: '查看监控', value: [] },
      ];
    },
  },

  methods: {
    gotoJobsTab() {
      this.$emit('goto-jobs-tab');
    },
  },
};
</script>
