<template>
    <div class="event-page">
        <div class="dao-setting-layout">
            <div class="dao-setting-section">
              <timeline empty-title="暂无数据" v-if="node">
                <timeline-item
                  v-for="(action, index) in sortEvents(node.items)"
                  :key="index"
                  :state="'success'"
                >
                  <span slot="right-title">{{ action.message }}</span>
                  <template slot="right-des">
                    <span> {{firstFromNow(action.metadata.creationTimestamp)}}&nbsp;&nbsp;</span>
                    <span
                      >来自 {{ action.source.component }}, {{ action.source.host
                      }}</span
                    >
                  </template>
                </timeline-item>
              </timeline>
            </div>
          </div>
    </div>
</template>
<script>
import { orderBy } from 'lodash';
import dayjs from 'dayjs';
import NodeService from '@/core/services/node.service';

export default {
  data() {
    return {
      node: {},
    };
  },
  created() {
    this.getEventsList();
  },
  methods: {
    getEventsList() {
      NodeService.getEvents(this.$route.params.node, this.$route.params.zone).then(res => {
        this.node = res;
      });
    },
    sortEvents(events) {
      return orderBy(events, 'metadata.creationTimestamp', 'asc');
    },
    firstFromNow(time) {
      return dayjs(time).fromNow();
    },
  },
};
</script>
