<template>
    <div id="zone">
      <div class="app-list">
        <div v-if="isSync">
          <dao-dialog
            v-if="isSync"
            :visible.sync="isSync"
            header="确认是否同步"
          >
            <div class="body">
              <div>确定同步本平台与harbor仓库的chart模板？</div>
              <div>此操作耗时可能较大，请耐心等待!</div>
            </div>
            <div slot="footer">
              <button class="dao-btn blue" @click="sureImport">确认</button>
              <button class="dao-btn" @click="ImportCancel">取消</button>
            </div>
          </dao-dialog>
        </div>
        <div v-if="showNewVersion">
          <dao-dialog
            v-if="showNewVersion"
            :visible.sync="showNewVersion"
            header="新增chart版本"
          >
            <div class="dao-setting-layout">
              <div class="dao-setting-section" style="padding: 20px;">
                <div class="dao-setting-item">
                  <div class="dao-setting-label dao-name">Chart 文件</div>
                  <div class="dao-setting-content">
                    <el-upload
                      class="upload-demo"
                      ref="upload"
                      action="#"
                      :http-request="handleUploadChart"
                      :file-list="chartList"
                      accept="application/zip, application/x-compressed, application/x-gzip"
                      :limit="1"
                      :before-upload="beforeUploadChart"
                      :on-remove="removeFileChart">
                      <button class="dao-btn blue">上传chart</button>
                    </el-upload>
                  </div>
                </div>
              </div>
            </div>
            <div slot="footer">
              <button class="dao-btn blue" @click="handleUploadChart">确认</button>
              <button class="dao-btn" @click="cancelUpload">取消</button>
            </div>
          </dao-dialog>
        </div>
        <span>
          资源类型：
          <dao-select
            v-model="type"
            size="sm"
            style="width: 160px; height: 32px;"
            @change="changeStatus"
          >
            <dao-option
              v-for="item in typeOptions"
              :key="item.value"
              :value="item.value"
              :label="item.text">
            </dao-option>
          </dao-select>
          <button
            class="dao-btn blue has-icon"
            style="margin-left: 10px;"
            @click="handleNewApplication"
          >
            <svg class="icon"><use xlink:href="#icon_plus-circled"></use></svg>
            <span class="text">导入应用模板</span>
          </button>
          <button
            class="dao-btn blue has-icon"
            style="margin-left: 10px;"
            @click="synchronism"
          >
            <svg class="icon"><use xlink:href="#icon_update"></use></svg>
            <span class="text">同步</span>
          </button>
        </span>
        <span style="float: right">
          <dao-input
            search
            placeholder="搜索"
            style="width: 200px; height: 32px;"
            @change="handleChange"
            v-model="search"
          >
          </dao-input>
          <button class="dao-btn icon-btn" style="margin-left: 10px;" @click="handleRefresh">
            <svg class="icon"><use xlink:href="#icon_cw"></use></svg>
          </button>
        </span>
      </div>
      <el-table
        style="width: 100%; margin-top: 20px;"
        :data="renderTable"
        v-loading="loading.zone"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table class="in-table"
              style="width: 100%;"
              :data="scope.row[scope.row.name]"
              :header-cell-style="{background:'#fff'}"
            >
              <el-table-column label="Chart 版本" prop="version" width="200"></el-table-column>
              <el-table-column label="APP版本" prop="appVersion" width="200"></el-table-column>
              <el-table-column label="维护者">
                <template slot-scope="scope">
                  {{ scope.row.supplier[0].name }}
                  <span
                    v-if="scope.row.supplier.length != 1">
                      ({{scope.row.supplier.length-1}}others)
                    </span>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" prop="date">
                <template slot-scope="scope">
                  {{ scope.row.createdAt | unix_date('YYYY/MM/DD HH:mm:ss') }}
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
<!--                            <dao-dropdown-item-->
<!--                              @click="uploadChartVersion(scope.row.name, scope.row.version)"-->
<!--                              style="margin-left: 10px" class="linkColor">-->
<!--                              <a ref="upload"-->
<!--                                 style="width: 100%;display: inline-block;">下载</a>-->
<!--                            </dao-dropdown-item>-->
                        <dao-dropdown-item
                          @click="deleteChartVersion(scope.row.appId,
                          scope.row.chartName, scope.row.version)"
                        >
                          <span style="color: red;">删除</span>
                        </dao-dropdown-item>
                      </dao-dropdown-menu>
                    </dao-dropdown>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="应用名称" prop="name">
        </el-table-column>
        <el-table-column label="供应商" prop="provider" width="100"></el-table-column>
        <el-table-column label="创建者" prop="ownerName" width="100"></el-table-column>
        <el-table-column label="类型" prop="appType"></el-table-column>
        <el-table-column label="版本数" prop="numVersion" width="80"></el-table-column>
        <el-table-column label="分类" prop="category"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | unix_date('YYYY/MM/DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="60">
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
                    @click="handleNewChartVersion(scope.row.id, scope.row.zoneId)">
                    <span style="color: #000;">新增chart版本</span>
                  </dao-dropdown-item>
                  <dao-dropdown-item
                    @click="handleClick(scope.row.id, scope.row.zoneId)"
                  >
                    <span style="color: red;">删除</span>
                  </dao-dropdown-item>
                </dao-dropdown-menu>
              </dao-dropdown>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <div class="page">共 {{TableNum()}} 项</div>
        <el-pagination
          :page-sizes="[10, 15, 20, 25]"
          :page-size="100"
          layout="sizes"
          style="padding-top: 5px;"
        >
        </el-pagination>
      </div>
    </div>
</template>

<script>
import ZoneAdminService from '@/core/services/zone-admin.service';
import newApp from './new-app';

export default {
  name: 'app-list',
  components: {
    newApp,
  },
  props: {
    id: String,
  },
  data() {
    return {
      activeName: 'first',
      select: 1,
      status: null, // 状态
      search: '', // 搜索
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
      type: '', // 资源状态
      typeOptions: [{
        text: '全部',
        value: '',
      }, {
        text: 'Helm Chart',
        value: 'Helm Chart',
      }],
      tableData: [],
      renderTable: [], // 渲染table的数据
      config: {
        visible: false,
      },
      chartBaseList: {},
      showPass: false, // 是否显示密码
      chartTableData: [], // chart管理渲染列表
      itemChart: [], // 展开行渲染列表
      loading: {
        zone: false,
      },
      isSync: false, // 是否点击了同步按钮
      showNewVersion: false, // 是否打开新增chart版本接口
      chartList: [], // charts上传
      chartType: ['application/zip', 'application/x-zip', 'application/x-compressed'],
      newChartVersionId: '', // 上传chart文件保存的ID
      newChartVersionZoneId: '', // 上传chart文件保存的ZoneID
    };
  },
  created() {
    this.getSelectZone();
  },
  methods: {
    /**
       * 请求可用区选中应用list
       */
    getSelectZone() {
      this.loading.zone = true;
      ZoneAdminService.getSelectedZone(this.id, this.type)
        .then(res => {
          this.tableData = res;
          this.renderTable = res;
          this.renderTable.forEach(item => {
            const category = item.category.join('，');
            item.category = category;
          });
          this.changeExpand();
        })
        .finally(() => {
          this.loading.zone = false;
        });
    },
    /**
     * 展开行改变
     */
    changeExpand() {
      if (this.tableData.length !== 0) {
        this.tableData.forEach(item => {
          ZoneAdminService.getChartVersionList(item.id).then(res => {
            item[item.name] = res;
          });
        });
      }
    },
    /**
     * 删除chart版本
     */
    deleteChartVersion(app_id, name, version) {
      // console.log(this.renderTable[name]);
      // if (this.renderTable[name].length === 1) {
      //   this.$noty.error('当前chart只有一个版本，不支持删除');
      //   return;
      // }
      ZoneAdminService.deleteChartVersion(this.id, app_id, name, version).then(() => {
        this.getSelectZone();
        this.$noty.success('删除成功');
      }).catch(() => {
        this.$message({
          message: '删除失败',
          type: 'warning',
        });
      });
    },
    // 数量
    TableNum() {
      return this.renderTable.length;
    },
    /**
       * 状态搜索
       */
    changeStatus() {
      this.getSelectZone();
    },
    /**
       * 新建一个应用按钮点击事件
       */
    handleNewApplication() {
      this.$router.push({
        name: 'manage.zone.newapp',
        params: {
          id: this.id,
        },
      });
      // this.$emit('addApplication');
    },
    /**
       * 下架应用
       */
    handleOff(id) {
      ZoneAdminService.availableOff(id).then(() => {
        this.getSelectZone();
        this.$noty.success('下架成功');
      });
    },
    /**
       * 上架应用
       */
    handleOn(id) {
      ZoneAdminService.availableOn(id).then(() => {
        this.getSelectZone();
        this.$noty.success('上架成功');
      });
    },
    /**
     * 上传chart新版本
     */
    handleNewChartVersion(id, zoneId) {
      this.showNewVersion = true;
      this.newChartVersionId = id;
      this.newChartVersionZoneId = zoneId;
    },
    /**
       * 删除应用
       */
    handleClick(id, zoneId) {
      ZoneAdminService.deleteApplication(id, zoneId).then(() => {
        this.$noty.success('删除成功');
        this.getSelectZone();
      });
    },
    /**
       * 给表格第一列加字体样式
       */
    cellStyle(column) {
      if (column.columnIndex === 0) {
        return {
          color: '#217EF2',
          cursor: 'pointer',
        };
      }
      return {};
    },
    /**
       * 表格某列被点击
       */
    cellClick(row, column) {
      if (column.label === '应用名称') {
        this.$router.push({
          name: 'application.detail',
          params: {
            id: row.id,
          },
        });
      }
    },
    /**
     * 键盘弹起事件
     */
    // handleKeyup(event) {
    //   console.log(event);
    // },
    /**
     * input的change事件
     * @param val
     */
    handleChange(val) {
      this.renderTable = [];
      this.tableData.forEach(item => {
        const str = item.name;
        if (str.search(val) !== -1) {
          this.renderTable.push(item);
        }
      });
    },
    /**
     * 刷新输入框
     */
    handleRefresh() {
      this.search = '';
      this.handleChange('');
    },
    /**
     * 确认导入
     */
    sureImport() {
      this.isSync = false;
      this.loading.zone = true;
      ZoneAdminService.syncHarborChart(this.id).then(res => {
        this.tableData = res;
        this.renderTable = res;
        this.renderTable.forEach(item => {
          const category = item.category.join(',');
          item.category = category;
        });
        this.$noty.success('同步成功');
      }).finally(() => {
        this.loading.zone = false;
      });
    },
    /**
     * 放弃导入
     */
    ImportCancel() {
      this.isSync = false;
    },
    /**
     * 点击同步按钮
     */
    synchronism() {
      this.isSync = true;
    },
    /**
     * 确认上传chart新版本-上传chart文件
     */
    handleUploadChart() {
      const formData = new FormData();
      this.chartList.forEach(file => {
        formData.append('chart', file);
      });
      ZoneAdminService.uploadNewChartVersion(
        this.newChartVersionZoneId, this.newChartVersionId, formData)
        .then(res => {
          if (res) {
            this.$noty.success('上传chart成功');
            this.getSelectZone();
          }
        })
        .catch(() => {
          this.removeFileChart();
        });
    },
    // 上传chart文件之前
    beforeUploadChart(file) {
      if (this.chartType.indexOf(file.type) < 0) {
        console.log(`文件MIME: ${file.type}`);
        this.$noty.warning('请选择正确的压缩格式文件');
        this.removeFileChart();
      } else {
        this.chartList = [];
        this.chartList = [...this.chartList, file];
      }
      return true;
    },
    /**
     * 删除chart文件
     */
    removeFileChart() {
      ZoneAdminService.deleteChartVersion(this.id, this.name, this.version).then(() => {
        this.chartList = [];
        this.name = '';
        this.description = '';
        this.$noty.success('chart文件删除');
      });
    },
    /**
     * 取消上传chart新版本
     */
    cancelUpload() {
      this.showNewVersion = false;
    },
  },
};
</script>
<style lang="scss" src="./application-list.scss"></style>

