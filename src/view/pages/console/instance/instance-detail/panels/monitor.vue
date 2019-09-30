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
import SpaceService from '@/core/services/space.service';
import { MONITOR_TIME_MAP } from '@/core/constants/constants';
import { mapState } from 'vuex';

export default {
  name: 'MonitorPanel',
  props: {
    instance: { type: String, required: true },
    type: { type: String, required: true },
  },
  data() {
    const timeRanges = Object.keys(MONITOR_TIME_MAP);
    return {
      filters: {
        timeRange: timeRanges[0],
      },
      timeRanges,
      loading: false,
      url: '',
    };
  },
  computed: {
    ...mapState(['space', 'zone']),
  },
  created() {
    this.onClickTimeRange();
  },

  methods: {
    async onClickTimeRange() {
      try {
        this.loading = true;
        this.url = (await this.getMonitor()).url;
      } finally {
        this.loading = false;
      }
    },
    getMonitor() {
      return SpaceService.getServiceMonitor(
        this.instance,
        this.space.id,
        this.zone.id,
        this.type,
        encodeURIComponent(MONITOR_TIME_MAP[this.filters.timeRange][0]),
        encodeURIComponent(MONITOR_TIME_MAP[this.filters.timeRange][1]),
      );
    },
  },
};
</script>

<style lang="scss">
  @import '@/view/pages/console/monitor/_monitor.scss';
</style>
