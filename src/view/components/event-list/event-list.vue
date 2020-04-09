<template>
  <timeline empty-title="列表为空">
    <mini-timeline-item
      v-for="(job, $index) in jobs.slice(0, 5)"
      :key="$index"
      :state="job.status"
      :btn-show="job.cancelable"
      btn-text="取消任务"
      @btn-event="cancelJob(job.id)"
    >
      <span slot="right-title">{{ job.owner.name }} {{ job.name }}</span>
      <template slot="right-des">
        <span class="right-des">{{ job.started_at | date_from }}&nbsp;&nbsp;&nbsp;</span>
      </template>
    </mini-timeline-item>
  </timeline>
</template>

<script>
import Timeline from '../timeline/timeline';

export default {
  name: 'EventList',
  components: {
    Timeline,
    MiniTimelineItem: Timeline.MiniItem,
  },
  props: {
    jobs: { type: Array, default: () => [] },
  },
  watch: {
    jobs(jobs) {
      this.jobs = jobs;
    },
  },
};
</script>
