import { POLL_INTERVAL } from '@/core/constants/constants';
import NodeService from '@/core/services/node.service';
import PodTable from '../pod-table/pod-table';


export default {
  name: 'ResourcePod',


  components: {
    PodTable,
  },

  data() {
    const { node, zone } = this.$route.params;
    return {
      loadings: {
        page: true,
        table: true,
      },
      pods: [],
      node,
      zone,
    };
  },

  created() {
    this.loadings.table = true;
    this.getPods().finally(() => {
      this.loadings.page = false;
      this.loadings.table = false;
    });
    this.poll();
  },

  destroyed() {
    this.unsetPolling();
  },

  methods: {
    poll() {
      this.pollTimer = setTimeout(() => {
        clearTimeout(this.pollTimer);
        this.getPods().then(() => {
          this.poll();
        });
      }, POLL_INTERVAL);
    },
    unsetPolling() {
      clearTimeout(this.pollTimer);
    },
    getPods() {
      return NodeService.getPods(this.node, this.zone)
        .then(({ items }) => {
          this.pods = items;
        })
        .catch(e => {
          console.error(e);
        });
    },
  },
};
