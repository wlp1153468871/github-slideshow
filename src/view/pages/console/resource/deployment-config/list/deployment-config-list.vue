<template>
  <div>
    <circle-loading v-if="loadings.page"></circle-loading>
    <div
      class="page-deployment-list"
      v-else>
      <resource-header :resource="resource"></resource-header>
      <div class="dao-view-main">
        <div class="dao-view-content">
          <div class="table-toolbar">
            <div class="table-toolbar-left">
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
            </div>
            <div class="table-toolbar-right">
              <dao-input
                search
                v-model="filterKey"
                :disabled="loadings.table"
                placeholder="请输入搜索内容">
              </dao-input>
              <button
                class="dao-btn"
                :disabled="loadings.table"
                style="margin-left: 10px;"
                @click="$emit('refresh')">
                <svg class="icon">
                  <use xlink:href="#icon_update"></use>
                </svg>
              </button>
            </div>
          </div>
          <el-table
            :data="dcsInCurrentPage"
            v-loading="loadings.table"
            style="width: 100%">
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
          </el-table>

          <el-pagination
            background
            :disabled="loadings.table"
            :page-sizes="[10,30,50]"
            :page-size.sync="pageSize"
            :current-page.sync="currentPage"
            layout="sizes, prev, pager, next"
            :total="totalPages">
          </el-pagination>

          <edit-yaml-dialog
            :value="dcTemplate"
            :visible="dialogConfigs.yamlEdit"
            @update="createByYaml"
            @close="dialogConfigs.yamlEdit = false">
          </edit-yaml-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { chunk, nth } from 'lodash';
import EditYamlDialog from '@/view/components/yaml-edit/edit-yaml.vue';
import ResourceTemplateService from '@/core/services/resource.template.service';
import DCService from '@/core/services/deployment-config.service.ts';
import DeploymentConfigResourceService from '@/core/services/deployment-config.resource.service';
import joinApproveStatus from '@/core/utils/joinApproveStatus.js';

export default {
  name: 'ResourceDeployments',

  comments: [EditYamlDialog],

  data() {
    const { dcCreate = 'false' } = this.$route.query;

    return {
      loadings: {
        page: true,
        deploymentConfigTable: true,
        deploymentsTable: true,
      },
      deploymentConfigs: [],
      dialogConfigs: {
        yamlEdit: JSON.parse(dcCreate),
      },
      filterKey: '',
      yamlJSON: {},
      dcTemplate: {},
      currentPage: 1,
      pageSize: 10,
    };
  },

  computed: {
    ...mapState(['space', 'zone', 'apiResource']),

    resource() {
      return {
        ...this.apiResource.DeploymentConfig,
        links: [
          {
            text: this.apiResource.DeploymentConfig.kind,
          },
        ],
      };
    },

    filteredDcs() {
      const filterKey = this.filterKey.toLowerCase();
      return this.deploymentConfigs.filter(dc =>
        dc.metadata.name.toLowerCase().includes(filterKey),
      );
    },

    paginaDcs() {
      return chunk(this.filteredDcs, this.pageSize);
    },

    dcsInCurrentPage() {
      return nth(this.paginaDcs, this.currentPage - 1);
    },

    totalPages() {
      return this.filteredDcs.length;
    },
  },

  created() {
    this.getDeploymentConfig();
  },

  methods: {
    getDeploymentConfig() {
      this.loadings.deploymentConfigTable = true;
      return DeploymentConfigResourceService.list(this.space.id, this.zone.id)
        .then(deploymentConfigs => {
          this.deploymentConfigs = joinApproveStatus(deploymentConfigs);
        })
        .finally(() => {
          this.loadings.page = false;
          this.loadings.table = false;
        });
    },

    getTemplate() {
      return ResourceTemplateService.getTemplate('deployment-config').then(
        template => {
          template.metadata.namespace = this.space.short_name;
          this.dcTemplate = template;
        },
      );
    },

    createByYaml(value) {
      this.loadings = true;
      DCService.post(value)
        .then(instance => {
          if (instance.is_need_approval) {
            this.$noty.success('请在审批记录页面，查看审批进度');
          } else {
            this.$noty.success('创建Deployment成功');
          }
          this.$emit('refresh');
          this.dialogConfigs.yamlEdit = false;
        })
        .finally(() => {
          this.loadings = false;
        });
    },
  },
};
</script>
