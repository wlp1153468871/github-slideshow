<template>
  <div>
    <div class="table-toolbar">
      <div class="table-toolbar-left">
        <button
          class="dao-btn blue has-icon"
          v-if="$can('create')"
          :disabled="loading"
          @click="dialogConfigs.yamlEdit = true">
          <svg class="icon">
            <use xlink:href="#icon_plus-circled"></use>
          </svg>
          <span class="text">创建</span>
        </button>
      </div>
      <div class="table-toolbar-right">
        <dao-input
          v-model="filterKey"
          search
          placeholder="请输入搜索内容">
        </dao-input>
        <button
          class="dao-btn"
          style="margin-left: 10px;"
          @click="$emit('refresh')">
          <svg class="icon">
            <use xlink:href="#icon_update"></use>
          </svg>
        </button>
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="deploymentsInCurrentPage"
      style="width: 100%">
      <el-table-column
        prop="metadata.name"
        label="名称">
        <template slot-scope="{ row: deployment }">
          <el-table-name-cell
            :resource="deployment"
            routerName="resource.deployments.detail">
          </el-table-name-cell>
        </template>
      </el-table-column>
      <el-table-column
        prop="deployment.kubernetes.io/revision"
        label="最新版本">
        <template slot-scope="{ row: deployment}">
          #{{ deployment | annotation('deployment.kubernetes.io/revision') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="spec.replicas"
        label="副本数">
      </el-table-column>
      <el-table-column
        prop="metadata.creationTimestamp"
        label="创建时间"
        width="180">
        <template slot-scope="{ row: deployment }">
          {{deployment.metadata.creationTimestamp | date}}
        </template>
      </el-table-column>
      <el-table-column
        prop="spec.strategy.type"
        label="发布策略">
      </el-table-column>
    </el-table>

    <el-pagination
      background
      :disabled="loading"
      :page-sizes="[10,30,50]"
      :page-size.sync="pageSize"
      :current-page.sync="currentPage"
      layout="sizes, prev, pager, next"
      :total="totalPages">
    </el-pagination>

    <edit-yaml-dialog
      :value="deploymentTemplate"
      :visible="dialogConfigs.yamlEdit"
      @update="createByYaml"
      @close="dialogConfigs.yamlEdit = false">
    </edit-yaml-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { chunk, nth } from 'lodash';
import tableView from '@/view/mixins/table-view';
import EditYamlDialog from '@/view/components/yaml-edit/edit-yaml';
import ResourceTemplateService from '@/core/services/resource.template.service';
import DeploymentResourceService from '@/core/services/deployment.resource.service';

export default {
  name: 'DeploymentsList',

  props: {
    deployments: { type: Array, default: () => [] },
    loading: { type: Boolean, default: true },
  },

  extends: tableView('id', 10, 'created_at', 'desc'),

  components: { EditYamlDialog },

  data() {
    const { create = 'false' } = this.$route.query;

    return {
      dialogConfigs: {
        yamlEdit: JSON.parse(create),
      },
      filterKey: '',
      yamlJSON: {},
      deploymentTemplate: {},
      currentPage: 1,
      pageSize: 10,
    };
  },

  computed: {
    ...mapState(['space', 'zone']),

    filteredDeployments() {
      const filterKey = this.filterKey.toLowerCase();
      return this.deployments.filter(deployment =>
        deployment.metadata.name.toLowerCase().includes(filterKey));
    },

    paginaDeployments() {
      return chunk(this.filteredDeployments, this.pageSize);
    },

    deploymentsInCurrentPage() {
      return nth(this.paginaDeployments, this.currentPage - 1);
    },

    totalPages() {
      return this.filteredDeployments.length;
    },
  },

  created() {
    this.getTemplate();
  },

  methods: {
    getTemplate() {
      ResourceTemplateService.getTemplate('deployment').then(template => {
        template.metadata.namespace = this.space.short_name;
        this.deploymentTemplate = template;
      });
    },

    // 创建yaml文件
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
</script>

<style lang="scss" scoped>
.deloyments-table {
  margin-top: 20px;
}
</style>
