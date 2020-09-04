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
          <button class="dao-btn" :disabled="offArr.length !== 0 || haveOn" @click="handleOn">批量上架</button>
        </div>
        <div style="margin-left: 10px">
          <button class="dao-btn" :disabled="onArr.length !== 0 || haveOff" @click="handleOff">批量下架</button>
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
        @selection-change="selectChange"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="应用名称" width="200">
          <template slot-scope="scope">
            <div style="color: #217EF2;">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="可用区" prop="zoneName" width="200"></el-table-column>
        <el-table-column label="供应商" prop="provider" width="150"></el-table-column>
        <el-table-column label="创建者" prop="ownerName" width="100"></el-table-column>
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
        <el-table-column label="类型" prop="appType" width="100"></el-table-column>
        <el-table-column label="版本数" prop="numVersion" width="80"></el-table-column>
        <el-table-column label="分类">
          <template slot-scope="scope">
            <span>{{scope.row.category.join('，')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="date" width="200">
          <template slot-scope="scope">
            {{ scope.row.createdAt | unix_date('YYYY/MM/DD HH:mm:ss') }}
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
      search: '', // 搜索
      tableData: [], // 表格数据
      loading: { // 加载圈圈
        appInfo: false,
      },
      selectedArray: [], // 选中的数组
      onArr: '',
      offArr: '',
      haveOn: true,
      haveOff: true,
    };
  },
  computed: {
    appNumber() {
      return this.tableData.length;
    },
  },
  created() {
    this.getSpaceAllAppList();
  },
  methods: {
    /**
     * 获取app列表
     */
    getSpaceAllAppList() {
      this.loading.appInfo = true;
      OrgService.getSpaceAllAppList(this.orgId, this.spaceId).then(res => {
        console.log(res);
        this.tableData = res;
      }).finally(() => {
        this.loading.appInfo = false;
      });
      this.getZone();
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
      console.log('选择改变');
      console.log(data);
      this.onArr = [];
      this.offArr = [];
      data.forEach(item => {
        if (item.space_available === '1') {
          this.offArr.push(item);
        }
        if (item.space_available === '0') {
          this.onArr.push(item);
        }
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
    },
    /**
     * 上架
     */
    handleOn() {
      if (this.selectedArray.length !== 0) {
        this.selectedArray.forEach(item => {
          OrgService.OnApplication(this.orgId, this.spaceId, item.id).then(res => {
            console.log(res);
            this.$noty.success('上架成功');
            this.getSpaceAllAppList();
          });
        });
      }
    },
    /**
     * 下架
     */
    handleOff() {
      if (this.selectedArray.length !== 0) {
        this.selectedArray.forEach(item => {
          OrgService.offApplication(this.orgId, this.spaceId, item.id).then(res => {
            console.log(res);
            this.$noty.success('下架成功');
            this.getSpaceAllAppList();
          });
        });
      }
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
