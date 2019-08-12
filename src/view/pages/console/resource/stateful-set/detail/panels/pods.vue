<template>
  <pod-table
    :canSelect="true"
    :pods="pods"
    :loading="loading"
    @remove="removePods"
    @refresh="getPods">
  </pod-table>
</template>

<script>
import StatefulSetService from '@/core/services/stateful-set.service.ts';
import PodService from '@/core/services/pod.service.ts';
import PodTable from '@/view/components/resource/pod-table/pod-table';

export default {
  name: 'PodsPanel',

  components: {
    PodTable,
  },

  props: {
    spaceId: String,
    zone: String,
    name: String,
  },


  data() {
    return {
      pods: [],
      loading: true,
    };
  },

  created() {
    this.getPods();
  },

  methods: {
    getPods() {
      this.loading = true;
      StatefulSetService.getPodList(this.spaceId, this.zone, this.name).then(res => {
        this.pods = res.originData.items || [];
      }).finally(() => {
        this.loading = false;
      });
    },
    onRefresh() {
      this.getPods();
    },
    removePods(pods) {
      this.$tada
        .confirm({
          title: '删除',
          text: `确认要删除 ${pods.length} 个容器组吗 ？`,
          primaryText: '确定',
          primaryLevel: 'success',
        })
        .then(willAgree => {
          if (willAgree) {
            this.loading = true;
            PodService.batchDelete({
              names: pods.map(p => p.metadata.name).join(','),
            }).then(() => {
              this.onRefresh();
            });
          }
        });
    },
  },
};
</script>

<style lang="scss">
</style>
