<template>
  <div>
    <circle-loading v-if="loadings.page"></circle-loading>
    <template v-else>
      <resource-header :resource="resource"></resource-header>

      <div class="dao-view-main">
        <div class="dao-view-content">
          <x-table
            :data="deploymentConfigs"
            :filter-method="filterMethod"
            :loading="loadings.table"
            @refresh="getDeploymentConfig">
            <template #operation>
              <button
                class="dao-btn dao-icon has-icon blue"
                v-if="$can('create')"
                :disabled="loadings.table"
                @click="dialogConfigs.yamlEdit = true">
                <svg class="icon">
                  <use xlink:href="#icon_plus-circled"></use>
                </svg>
                <span class="text">创建</span>
              </button>
            </template>
            <el-table-column
              prop="metadata.name"
              label="名称">
              <template slot-scope="{ row: dc }">
                <el-table-name-cell
                  :resource="dc"
                  routerName="resource.deploymentconfigs.detail">
                </el-table-name-cell>
              </template>
            </el-table-column>
            <el-table-column
              prop="status.latestVersion"
              label="当前版本">
            </el-table-column>
            <!--<el-table-column
              prop="metadata.status"
              label="状态">
              <template slot-scope="{ row: deployment }">
                <status-icon :status="deployment | deployment_status"></status-icon>
                <span class="status-detail">{{deployment | deployment_status}}</span>
              </template>
            </el-table-column> -->
            <el-table-column
              prop="metadata.creationTimestamp"
              label="创建时间"
              width="180">
              <template slot-scope="{ row: dc }">
                {{dc.metadata.creationTimestamp | date}}
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="address"
              label="触发 Trigger">
            </el-table-column> -->
          </x-table>
        </div>
      </div>
    </template>

    <edit-yaml-dialog
      :value="template"
      :visible="dialogConfigs.yamlEdit"
      @update="createByYaml"
      @close="dialogConfigs.yamlEdit = false"
    >
    </edit-yaml-dialog>
  </div>
</template>

<script>
import { RESOURCE_TYPE } from '@/core/constants/resource';
import ResourceMixin from '@/view/mixins/resource';
import DCService from '@/core/services/deployment-config.service.ts';
import DeploymentConfigResourceService from '@/core/services/deployment-config.resource.service';
import joinApproveStatus from '@/core/utils/joinApproveStatus.js';

export default {
  name: 'ResourceDeployments',

  mixins: [ResourceMixin(RESOURCE_TYPE.DEPLOYMENT_CONFIG)],

  data() {
    const { create = 'false' } = this.$route.query;

    return {
      loadings: {
        page: true,
        table: true,
      },
      deploymentConfigs: [],
      dialogConfigs: {
        yamlEdit: JSON.parse(create),
      },
      yamlJSON: {},
      filterMethod: (data, filterKey) =>
        data.metadata.name.toLowerCase().includes(filterKey),
    };
  },

  created() {
    this.getDeploymentConfig();
    this.getTemplate();
  },

  methods: {
    getDeploymentConfig() {
      this.loadings.table = true;
      return DeploymentConfigResourceService.list(this.space.id, this.zone.id)
        .then(deploymentConfigs => {
          this.deploymentConfigs = joinApproveStatus(deploymentConfigs);
        })
        .finally(() => {
          this.loadings.page = false;
          this.loadings.table = false;
        });
    },

    createByYaml(value) {
      DCService.post(value)
        .then(instance => {
          if (instance.is_need_approval) {
            this.$noty.success('请在审批记录页面，查看审批进度');
          } else {
            this.$noty.success('创建DeploymentConfig成功');
          }
          this.dialogConfigs.yamlEdit = false;
          this.getDeploymentConfig();
        });
    },
  },
};
</script>
