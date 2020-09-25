import { RESOURCE_TYPE } from '@/core/constants/resource';
import PodTable from '@/view/components/resource/pod-table/pod-table';
import { POLL_INTERVAL } from '@/core/constants/constants';
import PodService from '@/core/services/pod.service';
import ResourceMixin from '@/view/mixins/resource';

export default {
  name: 'ResourcePod',

  mixins: [ResourceMixin(RESOURCE_TYPE.POD)],

  components: {
    PodTable,
  },

  data() {
    return {
      loadings: {
        page: true,
        table: true,
      },
      pods: [],
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
      return PodService.list({})
        .then(({ items }) => {
          this.pods = items;
        })
        .catch(e => {
          console.error(e);
        });
    },
  },
};
