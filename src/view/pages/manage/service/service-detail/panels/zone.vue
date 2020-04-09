<template>
  <div>
    <dao-table-view :rows="rows" :config="tConfig" :loading="loading"> </dao-table-view>
  </div>
</template>

<script>
import { isEmpty } from 'lodash';
import tableView from '@/view/mixins/table-view';

export default {
  name: 'ZonePanel',

  extends: tableView('name', Infinity, 'name'),

  props: {
    service: { type: Object, default: () => ({}) },
    loading: { type: Boolean, default: false },
  },

  created() {
    this.initTableView();
  },

  methods: {
    initTableView() {
      this.setTableConfig({
        hideToolbar: true,
      });
      this.setTableProps([
        {
          id: 'zone.name',
          name: '可用区',
          sort: 'zone.name',
          value: 'zone.name',
        },
        {
          id: 'brokerService.name',
          name: 'Service Broker',
          sort: 'brokerService.name',
          value: 'brokerService.name',
        },
      ]);
    },
  },

  computed: {
    rows() {
      return isEmpty(this.service) ? [] : [this.service];
    },
  },
};
</script>
