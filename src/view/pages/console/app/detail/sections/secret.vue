<template>
  <dao-table-view
    ref="tableView"
    :rows="secrets"
    :config="tConfig">
    <div slot="tool" class="dao-table-view-left-bar">
      <span style="line-height: 32px;">Secret</span>
    </div>
  </dao-table-view>
</template>

<script>
import tableView from '@/view/mixins/table-view';

export default {
  name: 'SecretsSection',

  extends: tableView('id', 10, 'name'),

  props: {
    secrets: { type: Array, default: () => [] },
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
            onClick: secret => {
              this.$router.push({
                name: 'resource.secret',
                params: {
                  name: secret.metadata.name,
                },
              });
            },
          },
        },
        {
          id: 'label',
          name: '标签',
          sort: false,
          value(_, secret) {
            const {
              metadata: { labels = [] },
            } = secret;
            return Object.entries(labels)
              .map(([key, value]) => `${key} : ${value}`)
              .join(' ');
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
