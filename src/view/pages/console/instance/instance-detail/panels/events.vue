<template>
  <div class="dao-setting-layout">
    <timeline empty-title="列表为空">
      <timeline-item
        v-for="(job, $index) in jobs"
        :key="$index"
        :state="job.status"
        :btn-show="job.status === 'failed'"
        :is-error="job.status === 'failed'"
        btn-text="查看详情  >>"
        @btn-event="openErrorInfoDialog(job)">
        <span @click="openErrorInfoDialog(job)" slot="left">{{ job.status | ops_status }}</span>
        <span slot="right-title" class="green">{{ job.name }}</span>
        <template slot="right-des">
          <span>操作人：{{ job.owner.name }}&nbsp;&nbsp;&nbsp;</span>
          <span>{{ job.started_at | date_from }}&nbsp;&nbsp;&nbsp;</span>
          <span v-if="(job.ended_at - job.started_at) > 1">
            耗时 {{ job.ended_at | date_from(job.started_at) }}
          </span>
          <span v-else>耗时 1 秒内</span>
        </template>
      </timeline-item>
    </timeline>

    <error-info-dialog
      :visible="dialogConfigs.errorInfo.visible"
      :text="selectedInstanceInfo"
      @close="dialogConfigs.errorInfo.visible = false">
    </error-info-dialog>
  </div>
</template>

<script>
import ErrorInfoDialog from '@/view/pages/dialogs/instance/error-info';

export default {
  name: 'EventsPanel',
  components: {
    ErrorInfoDialog,
  },
  props: {
    jobs: { type: Array, default: () => [] },
  },
  data() {
    return {
      dialogConfigs: {
        errorInfo: { visible: false },
      },
      // 选中查看错误信息的实例
      selectedInstanceInfo: '',
    };
  },
  watch: {
    jobs(jobs) {
      this.jobs = jobs;
    },
  },
  methods: {
    openErrorInfoDialog(job) {
      this.selectedInstanceInfo = job.description;
      this.dialogConfigs.errorInfo.visible = true;
    },
  },
};
</script>
