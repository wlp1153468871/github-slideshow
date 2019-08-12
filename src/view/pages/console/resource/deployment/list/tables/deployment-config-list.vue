<template>
  <div class="deploymentConfig-table">
    <h4 class="resource-table-header">Deployment Config</h4>
    <div class="table-toolbar">
      <div class="table-toolbar-left">
        <button
          class="dao-btn dao-icon has-icon blue"
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
          search
          v-model="filterKey"
          :disabled="loading"
          placeholder="请输入搜索内容">
        </dao-input>
        <button
          class="dao-btn"
          :disabled="loading"
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
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        prop="metadata.name"
        label="名称">
        <template slot-scope="{ row: dc }">
          <el-table-name-cell
            :resource="dc"
            routerName="resource.deployment-config">
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
      :disabled="loading"
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
</template>

<script>
import { mapState } from 'vuex';
import { chunk, nth } from 'lodash';
import EditYamlDialog from '@/view/components/yaml-edit/edit-yaml.vue';
import ResourceTemplateService from '@/core/services/resource.template.service';
import DCService from '@/core/services/deployment-config.service.ts';

export default {
  name: 'DeploymentConfigList',

  props: {
    deploymentConfigs: { type: Array, default: () => [] },
    loading: { type: Boolean, default: true },
  },

  computed: {
    ...mapState(['space']),

    filteredDcs() {
      const filterKey = this.filterKey.toLowerCase();
      return this.deploymentConfigs.filter(dc =>
        dc.metadata.name.toLowerCase().includes(filterKey));
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

  components: { EditYamlDialog },

  data() {
    const { dcCreate = 'false' } = this.$route.query;

    return {
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

  created() {
    this.getTemplate();
  },

  // watch: {
  //   'dialogConfigs.yamlEdit': {
  //     handler(value) {
  //       this.$router.push({ query: { dcCreate: value } });
  //     },
  //   },
  // },

  methods: {
    getTemplate() {
      return ResourceTemplateService.getTemplate('deployment-config').then(template => {
        template.metadata.namespace = this.space.short_name;
        this.dcTemplate = template;
      });
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
