import { mapState } from 'vuex';
import { cloneDeep } from 'lodash';

import DeploymentConfigResourceService from '@/core/services/deployment-config.resource.service';
import ReportTable from './report-table/report-table.vue';

export default {
  data() {
    return {
      filterKey: '',
      deployment: [],
      deploymentConfig: [],
      deploymentBackUp: [],
      deploymentConfigBackUp: [],
      loading: false,
    };
  },
  computed: {
    ...mapState(['space', 'zone']),
  },
  async created() {
    this.setReports();
  },
  methods: {
    async setReports() {
      this.loading = true;
      let map;
      try {
        map = await DeploymentConfigResourceService.getResourceReports(this.space.id, this.zone.id);
        this.deployment = this.composeRows(map.Deployment);
        this.deploymentConfig = this.composeRows(map.DeploymentConfig);
      } finally {
        this.loading = false;
      }

      this.deploymentBackUp = cloneDeep(this.deployment);
      this.deploymentConfigBackUp = cloneDeep(this.deploymentConfig);
    },
    composeRows(data) {
      return Object.keys(data)
        .map(key => {
          const [memMax, memLimit, cpuMax, cpuLimit] = data[key];
          return {
            name: key,
            cpuMax,
            cpuLimit,
            memMax,
            memLimit,
          };
        });
    },
    searchDC(key) {
      if (key === '') {
        this.deploymentConfig = this.deploymentConfigBackUp;
      } else {
        this.deploymentConfig = this.deploymentConfigBackUp
          .filter(dc => dc.name.toLowerCase().indexOf(key.toLowerCase()) > -1);
      }
    },
    searchD(key) {
      if (key === '') {
        this.deployment = this.deploymentBackUp;
      } else {
        this.deployment = this.deploymentBackUp
          .filter(dc => dc.name.toLowerCase().indexOf(key.toLowerCase()) > -1);
      }
    },
  },
  components: {
    ReportTable,
  },
};
