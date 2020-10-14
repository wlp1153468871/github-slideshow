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
            header="新增 Chart 版本"
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
                      accept="application/zip, application/x-compressed,
              application/x-gzip, application/gzip, application/x-tar"
                      :limit="1"
                      :before-upload="beforeUploadChart"
                      :on-remove="removeFileChart">
                      <button class="dao-btn blue">上传chart</button>
                    </el-upload>
                    <div>支持zip, gzip, tgz, tar格式的压缩文件上传</div>
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
        <div v-if="deleteApplication">
          <dao-dialog
            v-if="deleteApplication"
            :visible.sync="deleteApplication"
            header="删除应用模板">
            <div class="body">
              <div>确定删除此应用模板？</div>
              <div>此操作为不可逆操作，请谨慎操作!</div>
            </div>
            <div slot="footer">
              <button class="dao-btn blue" @click="sureApplication">确认</button>
              <button class="dao-btn" @click="applicationCancel">取消</button>
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
            v-if="$can('platform.zone.applications.create')"
          >
            <svg class="icon"><use xlink:href="#icon_plus-circled"></use></svg>
            <span class="text">导入应用模板</span>
          </button>
          <button
            class="dao-btn blue has-icon"
            style="margin-left: 10px;"
            @click="synchronism"
            v-if="$can('platform.zone.applications.sync')"
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
        style="width: 100%; margin-top: 15px;"
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
              <el-table-column label="Chart 版本" prop="version" width="200" sortable>
              </el-table-column>
              <el-table-column label="APP版本" prop="appVersion" width="200" sortable>
              </el-table-column>
              <el-table-column label="维护者">
                <template slot-scope="scope">
                  <div v-if="`${scope.row.supplier}` === 'null'"></div>
                  <div v-else>
                    {{ scope.row.supplier[0].name }}
                    <span
                      v-if="scope.row.supplier.length != 1">
                        ({{scope.row.supplier.length-1}}others)
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" prop="date" sortable>
                <template slot-scope="scope">
                  {{ scope.row.createdAt | unix_date('YYYY-MM-DD HH:mm:ss') }}
                </template>
              </el-table-column>
              <el-table-column width="50">
                <template slot-scope="scope">
                  <span class="dao-btn-group">
                    <dao-dropdown
                      trigger="click"
                      :append-to-body="true"
                      placement="right-start"
                      v-if="$can('platform.zone.applications.action')"
                    >
                      <svg class="icon">
                        <use :xlink:href="`#icon_more`"></use>
                      </svg>
                      <dao-dropdown-menu
                        slot="list"
                        style="min-width: 120px;"
                      >
                        <dao-dropdown-item
                          @click="deleteChartVersion(scope.row.appId,
                          scope.row.chartName, scope.row.version)"
                          class="deleteHover"
                        >
                          <span class="delete">删除</span>
                        </dao-dropdown-item>
                      </dao-dropdown-menu>
                    </dao-dropdown>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="应用名称" prop="name" sortable>
        </el-table-column>
        <el-table-column label="供应商" prop="provider" width="100"></el-table-column>
        <el-table-column label="创建者" prop="ownerName" width="100"></el-table-column>
        <el-table-column label="类型" prop="appType"></el-table-column>
        <el-table-column label="版本数" prop="numVersion" width="100" sortable></el-table-column>
        <el-table-column label="分类" prop="category"></el-table-column>
        <el-table-column label="创建时间" prop="data" sortable>
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
                v-if="$can('platform.zone.applications.action')"
              >
                <svg class="icon">
                  <use :xlink:href="`#icon_more`"></use>
                </svg>
                <dao-dropdown-menu
                  slot="list"
                  style="min-width: 120px;"
                >
                  <dao-dropdown-item
                    @click="handleNewChartVersion(scope.row.id, scope.row.zoneId)">
                    <span style="color: #000;">新增chart版本</span>
                  </dao-dropdown-item>
                  <dao-dropdown-item
                    @click="handleClick(scope.row.id, scope.row.zoneId)"
                    class="deleteHover"
                  >
                    <span class="delete">删除</span>
                  </dao-dropdown-item>
                </dao-dropdown-menu>
              </dao-dropdown>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <div class="page">共 {{TableNum()}} 条</div>
        <el-pagination
          v-if="total"
          :page-sizes="[10, 15, 20, 25]"
          :page-size="100"
          :current-page.sync="currentPage"
          layout="sizes, prev, pager, next"
          style="padding-top: 5px;"
          @size-change="changeSize"
          @current-change="handleCurrentChange"
          :total="total"
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
      deleteApplication: false,
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
      renderTableCopy: [],
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
      chartType: ['application/zip', 'application/x-zip', 'application/x-compressed', 'application/x-tar', 'application/gzip', 'application/x-gzip'],
      newChartVersionId: '', // 上传chart文件保存的ID
      newChartVersionZoneId: '', // 上传chart文件保存的ZoneID
      size: 10,
      currentPage: 1,
      total: 0,
      deleteId: '',
      deleteZoneId: '',
      chartVersion: {},
      chartVersionFlag: false,
    };
  },

  watch: {
    size: {
      handler(size) {
        this.renderTable = this.renderTableCopy.slice(0, size);
      },
    },
    currentPage: {
      handler(currentPage) {
        this.renderTable = this.renderTableCopy.slice((currentPage - 1) * this.size,
          (currentPage) * this.size);
      },
    },
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
          this.renderTable = res.slice(0, 10);
          this.renderTableCopy = res;
          this.total = res.length;
          this.renderTableCopy.forEach(item => {
            const category = item.category.join('、');
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
      this.chartVersion = {
        app_id,
        name,
        version,
      };
      this.deleteApplication = true;
    },
    // 数量
    TableNum() {
      return this.renderTableCopy.length;
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
      this.deleteApplication = true;
      this.deleteId = id;
      this.deleteZoneId = zoneId;
    },
    /**
     * 确认删除
     */
    sureApplication() {
      if (this.chartVersion.app_id) {
        ZoneAdminService.deleteChartVersion(
          this.id, this.chartVersion.app_id,
          this.chartVersion.name,
          this.chartVersion.version).then(() => {
          this.getSelectZone();
          this.$noty.success('删除成功');
        }).catch(() => {
          this.$message({
            message: '删除失败',
            type: 'warning',
          });
        })
          .finally(() => {
            this.chartVersion = {};
          });
      } else {
        ZoneAdminService.deleteApplication(this.deleteId, this.deleteZoneId).then(() => {
          this.$noty.success('删除成功');
          this.getSelectZone();
        });
      }
      this.deleteApplication = false;
    },
    /**
     * 取消删除
     */
    applicationCancel() {
      this.deleteId = '';
      this.deleteZoneId = '';
      this.chartVersion = {};
      this.deleteApplication = false;
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
      // this.handleChange('');
      this.getSelectZone();
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
        this.changeExpand();
        this.$noty.success('同步成功');
        console.log(this.tableData);
        console.log(this.renderTable);
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
      if (this.chartList.length === 0) {
        this.$noty.error('chart文件不能为空');
      } else {
        const formData = new FormData();
        this.chartList.forEach(file => {
          formData.append('chart', file);
        });
        ZoneAdminService.uploadNewChartVersion(
          this.newChartVersionZoneId, this.newChartVersionId, formData)
          .then(res => {
            if (res) {
              this.$noty.success('上传chart成功');
              this.cancelUpload();
            }
          })
          .then(() => {
            this.getSelectZone();
          })
          .catch(() => {
            this.chartList = [];
            this.removeFileChart();
          });
      }
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
        this.isDisabled = false;
      }
      return false;
    },
    /**
     * 删除chart文件
     */
    removeFileChart() {
      // ZoneAdminService.deleteChartVersion(this.id, this.name, this.version).then(() => {
      //   this.chartList = [];
      //   this.name = '';
      //   this.description = '';
      //   this.$noty.success('chart文件删除');
      // });
      this.$refs.upload.clearFiles();
    },
    /**
     * 取消上传chart新版本
     */
    cancelUpload() {
      this.chartList = [];
      this.showNewVersion = false;
    },
    changeSize(size) {
      this.size = size;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
  },
};
</script>
<style lang="scss" src="./application-list.scss"></style>

