<template>
    <div id="zone">
      <div class="app-list">
        <div style="min-width: 560px">
          状态：
          <dao-select
            v-model="status"
            size="sm"
            style="width: 120px; height: 32px; margin-right: 10px;"
            @change="changeStatus"
          >
            <dao-option
              v-for="item in statusOptions"
              :key="item.value"
              :value="item.value"
              :label="item.text">
            </dao-option>
          </dao-select>
          资源类型：
          <dao-select
            v-model="type"
            size="sm"
            style="width: 160px; height: 32px;"
          >
            <dao-option
              v-for="item in typeOptions"
              :key="item.value"
              :value="item.value"
              :label="item.text">
            </dao-option>
          </dao-select>
          <button class="dao-btn blue has-icon"
                  style="margin-left: 10px;" @click="handleNewApplication">
            <svg class="icon"><use xlink:href="#icon_plus-circled"></use></svg>
            <span class="text">导入应用模板</span>
          </button>
        </div>
        <div style="min-width: 260px">
          <dao-input
            search
            placeholder="搜索"
            style="width: 200px; height: 32px;"
            @change="handleChange"
            v-model="search"
          >
          </dao-input>
          <el-button size="mini" @click="handleRefresh" style="margin-left: 10px;">
              <span>
                <svg class="icon">
                  <use :xlink:href="`#icon_cw`"></use>
                </svg>
              </span>
          </el-button>
        </div>
      </div>
      <el-table
        style="width: 100%; margin-top: 20px;"
        :data="renderTable"
        :cell-style="cellStyle"
        @cell-click="cellClick"
        v-loading="loading.zone"
      >
        <el-table-column label="应用名称" prop="name">
        </el-table-column>
        <el-table-column label="供应商" prop="provider" width="100"></el-table-column>
        <el-table-column label="创建者" prop="ownerName" width="100"></el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.available === 1">
              <svg class="icon" style="color: #25D473">
                <use :xlink:href="`#icon_status-dot-small`"></use>
              </svg>
              <span>已上架</span>
            </div>
            <div v-if="scope.row.available === 0">
              <svg class="icon" style="color: #CCD1D9">
                <use :xlink:href="`#icon_status-dot-small`"></use>
              </svg>
              <span>已下架</span>
            </div>

          </template>
        </el-table-column>
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
                    <dao-dropdown-item style="margin-left: 10px">
                      <span style="width: 100%;display: inline-block;"
                            v-if="scope.row.available === 1"
                            @click="handleOff(scope.row.id)">下架应用</span>
                      <span style="width: 100%;display: inline-block;"
                            v-if="scope.row.available === 0"
                            @click="handleOn(scope.row.id)">上架应用</span>
                    </dao-dropdown-item>
                    <dao-dropdown-item
                      style="margin-left: 10px"
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
        <span class="dao-btn-group" style="padding: 6px 10px 0 0; float: right;">
            <dao-dropdown
              trigger="click"
              :append-to-body="true"
              placement="bottom-start"
            >
              <button class="dao-btn has-icons" style="width: 92px;height: 28px;">
                <span class="text">10项/页</span>
                <svg class="icon"><use xlink:href="#icon_down-arrow"></use></svg>
              </button>
              <dao-dropdown-menu slot="list" style="min-width: 120px;">
                <dao-dropdown-item style="margin-left: 10px">
                  <span>15项/页</span>
                </dao-dropdown-item>
                <dao-dropdown-item style="margin-left: 10px">
                  <span>20项/页</span>
                </dao-dropdown-item>
                <dao-dropdown-item style="margin-left: 10px">
                  <span>25项/页</span>
                </dao-dropdown-item>
              </dao-dropdown-menu>
            </dao-dropdown>
          </span>
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
      type: 1, // 资源状态
      typeOptions: [{
        text: '全部',
        value: 1,
      }, {
        text: 'Helm Chart',
        value: 2,
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
      ZoneAdminService.getSelectedZone(this.id, this.status)
        .then(res => {
          this.tableData = res;
          this.renderTable = res;
          this.renderTable.forEach(item => {
            const category = item.category.join(',');
            item.category = category;
          });
        })
        .finally(() => {
          this.loading.zone = false;
        });
    },
    // 数量
    TableNum() {
      return this.renderTable.length;
    },
    /**
       * 状态搜索
       */
    changeStatus(val) {
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
      ZoneAdminService.availableOff(id).then(res => {
        this.getSelectZone();
        this.$noty.success('下架成功');
      });
    },
    /**
       * 上架应用
       */
    handleOn(id) {
      ZoneAdminService.availableOn(id).then(res => {
        this.getSelectZone();
        this.$noty.success('上架成功');
      });
    },
    /**
       * 删除应用
       */
    handleClick(id, zoneId) {
      ZoneAdminService.deleteApplication(id, zoneId).then(() => {
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
  },
};
</script>
<style lang="scss" src="./application-list.scss"></style>

