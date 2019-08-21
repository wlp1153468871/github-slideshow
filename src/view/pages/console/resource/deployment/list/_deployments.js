import { mapState } from 'vuex';
import DeploymentResourceService from '@/core/services/deployment.resource.service';
import DeploymentConfigResourceService from '@/core/services/deployment-config.resource.service';
import joinApproveStatus from '@/core/utils/joinApproveStatus.js';
import DeploymentsList from './tables/deployments-list';

export default {
  name: 'ResourceDeployments',

  components: { DeploymentsList },

  data() {
    return {
      loadings: {
        page: true,
        table: true,
      },
      deployments: [],
    };
  },

  computed: {
    ...mapState(['space', 'zone', 'apiResource']),

    resource() {
      return {
        ...this.apiResource.Deployment,
        links: [
          {
            text: this.apiResource.Deployment.kind,
          },
        ],
      };
    },
  },

  created() {
    this.getDeployments();
  },

  methods: {
    getDeployments() {
      this.loadings.table = true;
      return DeploymentResourceService.list(this.space.id, this.zone.id)
        .then(deployments => {
          this.deployments = joinApproveStatus(deployments);
        })
        .finally(() => {
          this.loadings.table = false;
          this.loadings.page = false;
        });
    },
  },
};
