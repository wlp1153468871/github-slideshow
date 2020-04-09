<template>
  <pod-table
    :canSelect="true"
    :pods="pods"
    :loading="loadings.table"
    @remove="removePods"
    @refresh="getPods"
  >
  </pod-table>
</template>

<script>
import PodTable from '@/view/components/resource/pod-table/pod-table';
import DeploymentResourceService from '@/core/services/deployment.resource.service';
import PodService from '@/core/services/pod.service.ts';
import { mapState } from 'vuex';
import { POLL_INTERVAL } from '@/core/constants/constants';

export default {
  name: 'OverviewPanel',

  components: {
    PodTable,
  },

  data() {
    const { name: deploymentName } = this.$route.params;
    return {
      loadings: {
        table: true,
      },
      pods: [],
      deploymentName,
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
  },

  created() {
    this.getPods().then(() => {
      this.poll();
    });
  },

  destroyed() {
    this.unsetPolling();
  },

  methods: {
    poll() {
      this.pollTimer = setTimeout(() => {
        clearTimeout(this.pollTimer);
        DeploymentResourceService.getPods(this.space.id, this.zone.id, this.deploymentName)
          .then(res => {
            this.pods = res.originData.items || [];
          })
          .then(() => {
            this.poll();
          });
      }, POLL_INTERVAL);
    },
    unsetPolling() {
      clearTimeout(this.pollTimer);
    },
    getPods() {
      this.loadings.table = true;
      return DeploymentResourceService.getPods(this.space.id, this.zone.id, this.deploymentName)
        .then(res => {
          this.pods = res.originData.items || [];
        })
        .catch(e => {
          console.error(e);
        })
        .finally(() => {
          this.loadings.table = false;
        });
    },

    removePods(selectedPods) {
      this.$tada
        .confirm({
          title: '删除',
          text: `确认要删除 ${selectedPods.length} 个容器组吗 ？`,
          primaryText: '确定',
          primaryLevel: 'success',
        })
        .then(willAgree => {
          if (willAgree) {
            this.loadings.table = true;
            PodService.batchDelete({
              names: selectedPods.map(p => p.metadata.name).join(','),
            }).then(() => {
              this.getPods();
            });
          }
        });
    },
  },
};
</script>
