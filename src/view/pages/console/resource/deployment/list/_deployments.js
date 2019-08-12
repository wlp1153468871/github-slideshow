import { mapState } from 'vuex';
import { RESOURCE } from '@/core/constants/resource';
import DeploymentResourceService from '@/core/services/deployment.resource.service';
import DeploymentConfigResourceService from '@/core/services/deployment-config.resource.service';
import joinApproveStatus from '@/core/utils/joinApproveStatus.js';
import DeploymentConfigList from './tables/deployment-config-list';
import DeploymentsList from './tables/deployments-list';

export default {
  name: 'ResourceDeployments',

  components: { DeploymentConfigList, DeploymentsList },

  data() {
    return {
      resource: {
        ...RESOURCE.DEPLOYMENT,
        links: [
          {
            text: RESOURCE.DEPLOYMENT.name,
          },
        ],
      },
      loadings: {
        page: true,
        deploymentConfigTable: true,
        deploymentsTable: true,
      },
      deployments: [],
      deploymentConfigs: [],
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
  },

  created() {
    this.loadDeployAndDc();
  },

  methods: {
    getDeployments() {
      this.loadings.deploymentsTable = true;
      return DeploymentResourceService.list(this.space.id, this.zone.id)
        .then(deployments => {
          this.deployments = joinApproveStatus(deployments);
        })
        .finally(() => {
          this.loadings.deploymentsTable = false;
        });
    },

    getDeploymentConfig() {
      this.loadings.deploymentConfigTable = true;
      return DeploymentConfigResourceService.list(this.space.id, this.zone.id)
        .then(deploymentConfigs => {
          this.deploymentConfigs = joinApproveStatus(deploymentConfigs);
        })
        .finally(() => {
          this.loadings.deploymentConfigTable = false;
        });
    },

    loadDeployAndDc() {
      this.loadings.page = true;
      Promise.all([this.getDeployments(), this.getDeploymentConfig()]).finally(() => {
        this.loadings.page = false;
      });
    },
  },
};
