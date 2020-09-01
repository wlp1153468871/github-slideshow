<template>
    <div id="zone">
      <div>
        <div class="base-info">
          <div class="info-header">基本信息</div>
          <div class="info-title2-layout">
            <div class="info-title">地址</div>
            <div class="info-desc">{{chartBaseList.url}}</div>
          </div>
          <div class="info-title2-layout">
            <div class="info-title">仓库名称</div>
            <div class="info-desc">{{chartBaseList.chart_repo}}</div>
          </div>
          <div class="info-title2-layout">
            <div class="info-title">账户</div>
            <div class="info-desc">{{chartBaseList.username}}</div>
          </div>
          <div class="info-title2-layout">
            <div class="info-title">密码</div>
            <div>
              <svg class="icon" style="float: left;cursor: pointer" @click="showPassword">
                <use :xlink:href="`#icon_eye-slash`"></use>
              </svg>
              <div v-if="!showPass" class="info-key">***********</div>
              <div v-if="showPass" class="info-key">{{chartBaseList.password}}</div>
            </div>
          </div>
        </div>
        <div class="chart-search">
          <dao-input
            search
            placeholder="搜索"
            class="search"
            @change="handleChange"
            v-model="search"
          >
          </dao-input>
          <span class="fresh">
            <el-button size="mini" @click="handleRefresh" style="margin-left: 10px;" >
              <span>
                <svg class="icon">
                  <use :xlink:href="`#icon_cw`"></use>
                </svg>
              </span>
            </el-button>
          </span>
        </div>
        <el-table
          style="width: 100%;"
          :data="renderTable"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-table class="in-table"
                        style="width: 100%;"
                        :data="scope.row[scope.row.name]"
                        :header-cell-style="{background:'#fff'}">
                <el-table-column label="Chart 版本" prop="version" width="200"></el-table-column>
                <el-table-column label="APP版本" prop="appVersion" width="200"></el-table-column>
                <el-table-column label="维护者">
                  <template slot-scope="scope">
                    {{ scope.row.maintainers[0].name }}
                    <span
                      v-if="scope.row.maintainers.length != 1">
                      ({{scope.row.maintainers.length-1}}others)
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="date">
                  <template slot-scope="scope">
                    {{ scope.row.created.split('T')[0] }}
                  </template>
                </el-table-column>
                <el-table-column width="50">
                  <template slot-scope="scope">
                      <span class="dao-btn-group">
                        <dao-dropdown
                          trigger="click"
                          :append-to-body="true"
                          placement="right-start"
                        >
                          <svg class="icon">
                            <use :xlink:href="`#icon_more`"></use>
                          </svg>
                          <dao-dropdown-menu slot="list" style="min-width: 120px;">
                            <dao-dropdown-item
                              @click="uploadChartVersion(scope.row.name, scope.row.version)"
                              style="margin-left: 10px" class="linkColor">
                              <a ref="upload" style="width: 100%;display: inline-block;">下载</a>
                            </dao-dropdown-item>
                            <dao-dropdown-item style="margin-left: 10px">
                              <span style="color: red;"
                                    @click="deleteChartVersion(scope.row.name, scope.row.version)"
                              >删除</span>
                            </dao-dropdown-item>
                          </dao-dropdown-menu>
                        </dao-dropdown>
                      </span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="name" width="300"></el-table-column>
          <el-table-column label="状态" prop="state" width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.deprecated === false">
                <svg class="icon" style="color: #25D473">
                  <use :xlink:href="`#icon_status-dot-small`"></use>
                </svg>
                <span>正常</span>
              </div>
              <div v-if="scope.row.deprecated === true">
                <svg class="icon" style="color: #ff0000">
                  <use :xlink:href="`#icon_status-dot-small`"></use>
                </svg>
                <span>不推荐使用</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="版本数" prop="total_versions" width="200"></el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              {{ scope.row.created.split('T')[0] }}
            </template>
          </el-table-column>
          <el-table-column width="50">
            <template slot-scope="scope">
                <span class="dao-btn-group">
                <dao-dropdown
                  trigger="click"
                  :append-to-body="true"
                  placement="right-start"
                >
                  <svg class="icon">
                    <use :xlink:href="`#icon_more`"></use>
                  </svg>
                  <dao-dropdown-menu slot="list" style="min-width: 120px;">
                    <dao-dropdown-item style="margin-left: 10px">
                      <span style="color: red;" @click="deleteChartAll(scope.row.name)">删除</span>
                    </dao-dropdown-item>
                  </dao-dropdown-menu>
                </dao-dropdown>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
</template>

<script>
import ZoneAdminService from '@/core/services/zone-admin.service';

export default {
  name: 'chart-list',
  props: {
    id: String,
  },
  data() {
    return {
      activeName: 'first',
      select: 1,
      status: null, // 状态
      statusOptions: [
        {
          text: '全部',
          value: null,
        },
        {
          text: '已上架',
          value: 1,
        },
        {
          text: '已下架',
          value: 0,
        },
      ],
      type: 1, // 资源状态
      typeOptions: [{
        text: '全部',
        value: 1,
      }, {
        text: 'Helm Chart',
        value: 2,
      }],
      tableData: [],
      chartData: [
        {
          type: '2.6.0',
          state: 'Active',
          defender: 'codefresh-io (2 other)',
          date: '2020-5-23 13:23:54',
        },
      ],
      config: {
        visible: false,
        footer: {
          cancelText: '取消',
          confirmText: '上传',
          confirmDisabled: true,
        },
      },
      chartBaseList: {},
      showPass: false, // 是否显示密码
      chartTableData: [], // chart管理列表
      renderTable: [], // chart管理渲染列表
      itemChart: [], // 展开行渲染列表
      search: '', // 搜索字段
    };
  },
  created() {
    this.getChartData();
  },
  methods: {
    /**
     * 获取chart列表数据
     */
    getChartData() {
      ZoneAdminService.getChartInformation(this.id).then(res => {
        console.log(res);
        this.chartBaseList = res;
        this.$noty.success('获取chart列表成功');
      });
      this.getChartTableData();
    },
    /**
     * 显示密码
     */
    showPassword() {
      this.showPass = !this.showPass;
    },
    /**
     * 获取chart管理的table数据
     */
    getChartTableData() {
      ZoneAdminService.getChartList(this.id).then(res => {
        console.log(res);
        this.chartTableData = res;
        this.renderTable = res;
        this.changeExpand();
      });
    },
    /**
     * 展开行改变
     */
    changeExpand() {
      if (this.chartTableData.length !== 0) {
        this.chartTableData.forEach(item => {
          ZoneAdminService.getChartVersionList(this.id, item.name).then(res => {
            console.log(res);
            item[item.name] = res;
            console.log(this.chartTableData, '改变后的数组');
          });
        });
      }
    },
    /**
     * 删除chart版本
     */
    deleteChartVersion(name, version) {
      console.log('删除chart版本');
      ZoneAdminService.deleteChartVersion(this.id, name, version).then(() => {
        this.getChartTableData();
        this.changeExpand();
        this.$noty.success('删除成功');
      }).catch(() => {
        this.$message({
          message: '删除失败',
          type: 'warning',
        });
      });
    },
    /**
     * 下载chart版本
     */
    uploadChartVersion(name, version) {
      ZoneAdminService.uploadChart(this.id, name, version).then(res => {
        const blob = new Blob([res], { type: 'application/x-compressed' });
        const a = this.$refs.upload;
        a.href = URL.createObjectURL(blob);
        a.download = `${name}.tgz`;
        a.click();
        URL.revokeObjectURL(a.href);
        a.remove();
      }).catch(() => {
        this.$noty.error('下载失败');
      });
    },
    /**
     * 删除所有chart版本
     */
    deleteChartAll(name) {
      ZoneAdminService.deleteChartAll(this.id, name).then(res => {
        console.log(res);
        this.getChartTableData();
        this.$noty.success('删除成功');
      });
    },
    /**
     * 搜索
     */
    handleChange(val) {
      this.renderTable = [];
      console.log(val);
      this.chartTableData.forEach(item => {
        const str = item.name;
        if (str.search(val) !== -1) {
          this.renderTable.push(item);
        }
      });
    },
    /**
     * 刷新
     */
    handleRefresh() {
      this.search = '';
      this.handleChange('');
    },
  },
};
</script>
<style scope>
  .linkColor a:hover {
    color: #fff;
  }
</style>
<style lang="scss" src="./application-list.scss"></style>
