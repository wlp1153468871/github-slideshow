<template>
  <div id="monitor">
    <template>
      <el-form
        :inline="true"
        class="demo-form-inline form-panel"
        :model="filters"
      >
        <el-form-item label="">
          <slot name="prefix">
            <i class="el-icon-time timeRangeIcon"></i>
          </slot>
          <el-select
            filterable
            size="small"
            :disabled="loading"
            v-model="filters.timeRange"
            placeholder=""
            @change="onClickTimeRange"
          >
            <el-option
              :value="t"
              :label="t"
              v-for= "(t, index) in timeRanges"
              :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <iframe
        class="monitor-frame"
        :src="url"
        frameborder="0">
      </iframe>
    </template>
  </div>
</template>
<script>
import { MONITOR_TIME_MAP } from '@/core/constants/constants';
import PodService from '@/core/services/pod.service';

export default {
  data() {
    const timeRanges = Object.keys(MONITOR_TIME_MAP);
    const instanceName = 'instance';
    return {
      filters: {
        timeRange: timeRanges[0],
      },
      timeRanges,
      loading: false,
      instanceName,
      pod: this.$route.params.name,
      url: '',
    };
  },
  methods: {
    async onClickPod() {
      const params = {
        instance: this.instanceName,
        numberEx: 1,
        pod: this.pod,
      };
      try {
        this.loading = true;
        this.url = await this.getPodMonitor(params);
      } finally {
        this.loading = false;
      }
    },
    async getPodMonitor({ instance, pod, numberEx }) {
      const { url } = await PodService.fetchContainerMonitorUrl({
        pod,
        instance,
        numberEx,
        from: encodeURIComponent(MONITOR_TIME_MAP[this.filters.timeRange][0]),
        to: encodeURIComponent(MONITOR_TIME_MAP[this.filters.timeRange][1]),
      });
      return url;
    },
    onClickTimeRange() {
      this.onClickPod();
    },
  },
  created() {
    this.onClickPod();
  },
};
</script>
<style lang="scss">
  @import '@/view/pages/console/monitor/_monitor.scss';
</style>
