<template>
  <div class="availableTemplate">
    <div class="template-head">
      <div class="screen">
        <div>
          可用区：
          <dao-select
          v-model="zone"
          placeholder="请选择"
          style="width: 150px"
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
            style="width: 150px">
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
            style="width: 150px">
            <dao-option
              v-for="item in typeOptions"
              :key="item.id"
              :value="item.id"
              :label="item.name">
            </dao-option>
          </dao-select>
        </div>
        <div style="margin-left: 10px">
          <button class="dao-btn">批量下架</button>
        </div>
      </div>
      <div class="search">
        <dao-input
          search
          placeholder="搜索"
          style="width: 200px; height: 32px;"
          v-model="search"
        >
        </dao-input>
        <el-button size="mini" style="margin-left: 10px;">
              <span>
                <svg class="icon">
                  <use :xlink:href="`#icon_cw`"></use>
                </svg>
              </span>
        </el-button>
      </div>
    </div>
    <div style="margin: 20px;">
      <el-table
        style="width: 100%;"
        :data="tableData"
        v-loading="loading.appInfo"
        @select="selectChange"
        @selection-change="selectAll"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="应用名称">
          <template slot-scope="scope">
            <div style="color: #217EF2;cursor: pointer;" @click="rowClick(scope.row.id)">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="可用区" prop="zoneName"></el-table-column>
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
            <div v-else>
              <svg class="icon" style="color: #CCD1D9">
                <use :xlink:href="`#icon_status-dot-small`"></use>
              </svg>
              <span>已下架</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="appType" width="100"></el-table-column>
        <el-table-column label="版本数" prop="numVersion" width="80"></el-table-column>
        <el-table-column label="分类">
          <template slot-scope="scope">
            <span
              class="str"
              v-for="(item, index) in scope.row.category"
              :key="index"
            >
              {{item}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="date">
          <template slot-scope="scope">
            {{ scope.row.createdAt | unix_date('YYYY/MM/DD HH:mm:ss') }}
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <div class="page">共 {{appNumber}} 项</div>
        <span class="dao-btn-group" style="padding: 6px 10px 0 0; float: right;">
          <dao-dropdown
            trigger="click"
            :append-to-body="true"
            placement="bottom-start"
          >
            <button class="dao-btn has-icons" style="width: 92px;height: 28px;">
              <span class="text">10条/页</span>
              <svg class="icon"><use xlink:href="#icon_down-arrow"></use></svg>
            </button>
            <dao-dropdown-menu slot="list" style="min-width: 120px;">
              <dao-dropdown-item style="margin-left: 10px">
                <span>15条/页</span>
              </dao-dropdown-item>
              <dao-dropdown-item style="margin-left: 10px">
                <span>20条/页</span>
              </dao-dropdown-item>
              <dao-dropdown-item style="margin-left: 10px">
                <span>25条/页</span>
              </dao-dropdown-item>
            </dao-dropdown-menu>
          </dao-dropdown>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'applist',
  data() {
    return {
      zone: '', // 选择可用区
      zoneOptions: [{
        name: '全部',
        id: '',
      }, {
        name: 'k8s',
        id: 1,
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
        id: 2,
      }],
      type: '', // 资源类型
      typeOptions: [{
        name: '全部',
        id: '',
      }, {
        name: 'helm chart',
        id: 'helm chart',
      }, {
        name: 'broker',
        id: 'broker',
      }],
      search: '', // 搜索
      tableData: [], // 表格数据
      loading: { // 加载圈圈
        appInfo: false,
      },
    };
  },
  computed: {
    appNumber() {
      return this.tableData.length;
    },
  },
  methods: {
    /**
     * 选择
     */
    selectChange() {

    },
    /**
     * 选择改变
     */
    selectAll() {

    },
  },
};
</script>

<style lang="scss" scoped>
.availableTemplate {
  background-color: #F1F3F6;
  .template-head {
    display: flex;
    justify-content: space-between;
    margin: 5px 20px 15px 20px;
    /*min-width: 1110px;*/
    .screen {
      display: flex;
      justify-content: start;
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
      padding: 10px 0 0 10px;
      font-size: 14px;
      font-family: PingFangSC-Regular,PingFang SC;
      font-weight: 400;
      color: #9BA3AF;
    }
  }
}
</style>
