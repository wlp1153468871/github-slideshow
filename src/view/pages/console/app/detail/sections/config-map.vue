<template>
  <dao-table-view ref="tableView" :rows="configMaps" :config="tConfig">
    <div slot="tool" class="dao-table-view-left-bar">
      <span style="line-height: 32px;">Config Map</span>
    </div>
  </dao-table-view>
</template>

<script>
import tableView from '@/view/mixins/table-view';

export default {
  name: 'ConfigMapSection',

  extends: tableView('id', 10, 'name'),

  props: {
    configMaps: { type: Array, default: () => [] },
  },

  created() {
    this.initTableView();
  },

  methods: {
    initTableView() {
      this.setTableConfig({
        hideRefresh: true,
      });

      this.setTableProps([
        {
          id: 'name',
          name: '名称',
          value: 'metadata.name',
          sort: 'metadata.name',
          type: 'goto',
          other: {
            onClick: configMap => {
              this.$router.push({
                name: 'resource.configmaps.detail',
                params: {
                  name: configMap.metadata.name,
                },
              });
            },
          },
        },
        {
          id: 'label',
          name: '标签',
          sort: false,
          value(_, configMap) {
            const {
              metadata: { labels = [] },
            } = configMap;
            return (
              Object.entries(labels)
                .map(([key, value]) => `${key} : ${value}`)
                .join(' ')
                .trim() || '-'
            );
          },
        },
        {
          id: 'creationTimestamp',
          name: '创建时间',
          value: 'metadata.creationTimestamp',
          sort: 'metadata.creationTimestamp',
          filter: 'date',
        },
      ]);
    },
  },
};
</script>
