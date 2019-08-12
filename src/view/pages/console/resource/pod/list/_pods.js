import PodTable from '@/view/components/resource/pod-table/pod-table';
import { RESOURCE } from '@/core/constants/resource';
import { POLL_INTERVAL } from '@/core/constants/constants';
import PodService from '@/core/services/pod.service';

export default {
  name: 'ResourcePod',

  components: {
    PodTable,
  },

  data() {
    return {
      resource: {
        ...RESOURCE.POD,
        links: [
          {
            text: RESOURCE.POD.name,
          },
        ],
      },
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
