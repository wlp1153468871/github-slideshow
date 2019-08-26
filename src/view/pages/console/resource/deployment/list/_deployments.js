import { RESOURCE_TYPE } from '@/core/constants/resource';
import ResourceMixin from '@/view/mixins/resource';
import DeploymentResourceService from '@/core/services/deployment.resource.service';
import joinApproveStatus from '@/core/utils/joinApproveStatus.js';

export default {
  name: 'ResourceDeployments',

  mixins: [ResourceMixin],

  data() {
    const { create = 'false' } = this.$route.query;

    return {
      kind: RESOURCE_TYPE.DEPLOYMENT,
      loadings: {
        page: true,
        table: true,
      },
      deployments: [],
      dialogConfigs: {
        yamlEdit: JSON.parse(create),
      },
      yamlJSON: {},
    };
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

    createByYaml(value) {
      DeploymentResourceService.create(this.space.id, this.zone.id, value).then(instance => {
        if (instance.is_need_approval) {
          this.$noty.success('请在审批记录页面，查看审批进度');
        } else {
          this.$noty.success('创建Deployment成功');
        }
        this.dialogConfigs.yamlEdit = false;
        this.$emit('refresh');
      });
    },
  },
};
