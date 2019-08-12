<template>
  <dao-table-view
    ref="tableView"
    :rows="rows"
    :config="tConfig"
    @refresh="loadEvents">
  </dao-table-view>
</template>

<script>
import tableView from '@/view/mixins/table-view';
import ApplicationService from '@/core/services/application.service';

export default {
  name: 'EventPanel',

  extends: tableView('id', 20, 'PodName', 'asc'),

  props: {
    zoneId: { type: String, default: '' },
    instance: { type: Object, default: () => ({}) },
  },

  created() {
    this.initTableView();
    this.loadEvents();
  },

  data() {
    return {
      DEFAULT_SIZE: 200,
      rows: [],
    };
  },

  methods: {
    initTableView() {
      this.setTableProps([
        {
          id: 'firstTimestamp',
          name: '首次出现时间',
        },
        {
          id: 'kind',
          name: '资源类型',
          value: 'involvedObject.kind',
          sort: 'involvedObject.kind',
        }, {
          id: 'name',
          name: '资源名称',
          value: 'involvedObject.name',
          sort: 'involvedObject.name',
        }, {
          id: 'reason',
          name: '原因',
        }, {
          id: 'message',
          name: '信息',
          title: true,
        },
      ]);
    },

    async loadEvents() {
      return ApplicationService
        .listEvent(this.instance.id, this.zoneId, this.DEFAULT_SIZE)
        .then(res => {
          this.rows = res.items;
        });
    },
  },
};
</script>
