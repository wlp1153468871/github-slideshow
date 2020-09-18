<template>
  <div class="availableTemplate">
    <div class="template-head">
      <div class="screen">
        <div>
          可用区：
          <dao-select
          v-model="zone"
          placeholder="请选择"
          style="width: 160px"
          @change="handleChange"
          >
          <dao-option
            v-for="item in zoneOptions"
            :key="item.id"
            :value="item.id"
            :label="item.name">
          </dao-option>
          </dao-select>
        </div>
        <div style="margin-left: 10px">
          状态：
          <dao-select
            v-model="status"
            placeholder="请选择"
            style="width: 150px"
          @change="handleChange">
            <dao-option
              v-for="item in statusOptions"
              :key="item.id"
              :value="item.id"
              :label="item.name">
            </dao-option>
          </dao-select>
        </div>
        <div style="margin-left: 10px">
          资源类型：
          <dao-select
            v-model="type"
            placeholder="请选择"
            style="width: 150px"
          @change="handleChange">
            <dao-option
              v-for="item in typeOptions"
              :key="item.id"
              :value="item.id"
              :label="item.name">
            </dao-option>
          </dao-select>
        </div>
        <button
          class="dao-btn"
          style="margin-left: 10px"
          :disabled="offArr.length !== 0 || haveOn"
          @click="handleOn">批量上架
        </button>
        <button
          class="dao-btn"
          style="margin-left: 10px"
          :disabled="onArr.length !== 0 || haveOff"
          @click="handleOff">批量下架
        </button>
        <dao-dialog
          :visible.sync="isForbidden"
          header="确认是否下架"
        >
          <div class="body">
            <div>禁用后应用模板在已添加的项目组将不可见</div>
            <div>但不会删除底层实例，是否下架？</div>
          </div>
          <div slot="footer">
            <button class="dao-btn blue" @click="forbidden">下架</button>
            <button class="dao-btn" @click="cancel">取消</button>
          </div>
        </dao-dialog>
      </div>
      <div class="search">
        <dao-input
          search
          placeholder="搜索"
          style="width: 200px; height: 32px;"
          v-model="key"
          @change="search"
        >
        </dao-input>
        <!-- <el-button size="mini" style="margin-left: 10px;">
          <span>
            <svg class="icon">
              <use :xlink:href="`#icon_cw`"></use>
            </svg>
          </span>
        </el-button> -->
        <button class="dao-btn icon-btn" style="margin-left: 10px;" @click="fresh">
          <svg class="icon"><use xlink:href="#icon_cw"></use></svg>
        </button>
      </div>
    </div>
    <div style="margin: 15px;">
      <el-table
        style="width: 100%;"
        :data="tableData"
        v-loading="loading.appInfo"
        @selection-change="selectChange"
        :row-class-name="rowStyle"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="应用名称" prop="name">
          <!-- <template slot-scope="scope">
            <div style="color: #217EF2;">
              {{ scope.row.name }}
            </div>
          </template> -->
        </el-table-column>
        <el-table-column label="可用区" prop="zoneName"></el-table-column>
        <el-table-column label="供应商" prop="provider"></el-table-column>
        <el-table-column label="创建者" prop="ownerName"></el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.space_available === '1'">
              <svg class="icon" style="color: #25D473">
                <use :xlink:href="`#icon_status-dot-small`"></use>
              </svg>
              <span>已上架</span>
            </div>
            <div v-else>
              <svg class="icon" style="color: #CCD1D9">
                <use :xlink:href="`#icon_status-dot-small`"></use>
              </svg>
              <span>已下架</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="appType"></el-table-column>
        <el-table-column label="版本数" prop="numVersion"></el-table-column>
        <el-table-column label="分类">
          <template slot-scope="scope">
            <span>{{scope.row.category.join('，')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="date">
          <template slot-scope="scope">
            {{ scope.row.createdAt | unix_date('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
<!--        <el-table-column  label="操作">-->
<!--          <template slot-scope="scope">-->
<!--              <span class="dao-btn-group">-->
<!--                <dao-dropdown-->
<!--                  trigger="click"-->
<!--                  :append-to-body="true"-->
<!--                  placement="right-start"-->
<!--                >-->
<!--                  <svg class="icon">-->
<!--                    <use :xlink:href="`#icon_more`"></use>-->
<!--                  </svg>-->
<!--                  <dao-dropdown-menu slot="list" style="min-width: 120px;">-->
<!--                    <dao-dropdown-item-->
<!--                      style="margin-left: 10px"-->
<!--                      @click="handleClick(scope.row.id, scope.row.zoneId)"-->
<!--                    >-->
<!--                      <span style="color: red;">删除</span>-->
<!--                    </dao-dropdown-item>-->
<!--                  </dao-dropdown-menu>-->
<!--                </dao-dropdown>-->
<!--              </span>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
      <div class="footer">
        <div class="page">共 {{appNumber}} 项</div>
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
  </div>
</template>

<script>
import OrgService from '@/core/services/org.service';
import SpaceService from '@/core/services/space.service';

export default {
  name: 'applist',
  props: {
    spaceId: {
      type: String,
      default() {
        return '';
      },
    },
    orgId: {
      type: String,
      default() {
        return '';
      },
    },
  },
  data() {
    return {
      zone: '', // 选择可用区
      zoneOptions: [{
        name: '全部',
        id: '',
      }],
      status: '', // 状态
      statusOptions: [{
        name: '全部',
        id: '',
      }, {
        name: '已上架',
        id: 1,
      }, {
        name: '已下架',
        id: 0,
      }],
      type: '', // 资源类型
      typeOptions: [{
        name: '全部',
        id: '',
      }, {
        name: 'Helm Chart',
        id: 'Helm Chart',
      }, {
        name: 'Broker',
        id: 'Broker',
      }],
      key: '', // 搜索
      tableData: [], // 表格数据
      tableDataCopy: [],
      loading: { // 加载圈圈
        appInfo: false,
      },
      selectedArray: [], // 选中的数组
      indexArr: [],
      onArr: '',
      offArr: '',
      haveOn: true,
      haveOff: true,
      isForbidden: false,
      size: 10,
      currentPage: 1,
      total: 0,
    };
  },
  computed: {
    appNumber() {
      return this.tableDataCopy.length;
    },
  },
  watch: {
    size: {
      handler(size) {
        this.tableData = this.tableDataCopy.slice(0, size);
      },
    },
    currentPage: {
      handler(currentPage) {
        this.tableData = this.tableDataCopy.slice((currentPage - 1) * this.size,
          (currentPage) * this.size);
      },
    },
  },
  created() {
    this.getSpaceAllAppList();
    this.getZone();
  },
  methods: {
    /**
     * 获取app列表
     */
    getSpaceAllAppList() {
      this.loading.appInfo = true;
      OrgService.getSpaceAllAppList(this.orgId, this.spaceId, this.status, this.zone, this.type)
        .then(res => {
          this.tableData = res.slice((this.currentPage - 1) * this.size,
            (this.currentPage) * this.size);
          this.tableDataCopy = res;
          this.total = res.length;
        })
        .finally(() => {
          this.loading.appInfo = false;
        });
    },
    /**
     * 可用区列表
     */
    getZone() {
      this.loading.appInfo = true;
      this.zoneOptions = [];
      const obj = {
        id: '',
        name: '全部',
      };
      this.zoneOptions.push(obj);
      SpaceService.getSpaceZones(this.spaceId)
        .then(zones => {
          zones.forEach(item => {
            const newObj = {
              id: item.id,
              name: item.name,
            };
            this.zoneOptions.push(newObj);
          });
        })
        .finally(() => {
          this.loading.loading = false;
        });
    },
    /**
     * 改变选择
     */
    selectChange(data) {
      this.onArr = [];
      this.offArr = [];
      const indexArr = [];
      data.forEach(item => {
        if (item.space_available === '1') {
          this.offArr.push(item);
        }
        if (item.space_available === '0') {
          this.onArr.push(item);
        }
        this.tableData.forEach((val, index) => {
          if (item.id === val.id) indexArr.push(index);
        });
      });
      if (this.onArr.length !== 0) {
        this.haveOn = false;
      } else {
        this.haveOn = true;
      }
      if (this.offArr.length !== 0) {
        this.haveOff = false;
      } else {
        this.haveOff = true;
      }
      this.selectedArray = data;

      this.indexArr = indexArr;
    },
    /**
     * 上架
     */
    handleOn() {
      if (this.selectedArray.length !== 0) {
        this.selectedArray.forEach(item => {
          OrgService.OnApplication(this.orgId, this.spaceId, item.id).then(() => {
            this.getSpaceAllAppList();
          });
        });
        this.$noty.success('上架成功');
      }
    },
    /**
     * 下架
     */
    handleOff() {
      this.isForbidden = true;
    },
    handleChange() {
      this.getSpaceAllAppList();
    },
    // 搜索
    search(val) {
      this.tableData = this.tableDataCopy.filter(item => item.name.includes(val))
        .slice((this.currentPage - 1) * this.size, (this.currentPage) * this.size);
    },
    // 刷新
    fresh() {
      this.key = '';
      this.getSpaceAllAppList();
    },
    changeSize(size) {
      this.size = size;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
    rowStyle({ rowIndex }) {
      return this.indexArr.includes(rowIndex) ? 'rowStyle' : '';
    },
    // 确认禁用
    forbidden() {
      this.isForbidden = false;
      if (this.selectedArray.length !== 0) {
        this.selectedArray.forEach(item => {
          OrgService.offApplication(this.orgId, this.spaceId, item.id).then(() => {
            this.getSpaceAllAppList();
          });
        });
        this.$noty.success('下架成功');
      }
    },
    cancel() {
      this.isForbidden = false;
    },
  },
};
</script>

<style lang="scss">
.availableTemplate {
  background-color: #F1F3F6;
  .el-table{
    tr.rowStyle {
      background-color: #E8F1FC;
    }
  }
  .template-head {
    display: flex;
    justify-content: space-between;
    margin: 5px 20px 15px 20px;
    /*min-width: 1110px;*/
    .screen {
      display: flex;
      justify-content: flex-start;
      .body {
        padding: 20px;
      }
    }
  }
  .footer {
    height: 40px;
    border-right: 1px solid #E4E7ED;
    border-left: 1px solid #E4E7ED;
    border-bottom: 1px solid #E4E7ED;
    background: #fff;
    .page {
      float: left;
      height: 14px;
      line-height: 14px;
      padding: 12px 0 0 10px;
      font-size: 14px;
      font-family: PingFangSC-Regular,PingFang SC;
      font-weight: 400;
      color: #9BA3AF;
    }
  }
}
</style>
