<template>
  <div id="service">
    <div class="layout-content-header service-header">
      服务管理
    </div>
    <div style="margin: 20px;">
      可用区：
      <dao-select
        v-model="select"
        size="sm"
        style="width: 180px; height: 32px; margin-right: 10px;"
      >
        <dao-option
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          :label="item.text">
        </dao-option>
      </dao-select>
      状态：
      <dao-select
        v-model="select"
        size="sm"
        style="width: 120px; height: 32px; margin-right: 10px;"
      >
        <dao-option
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          :label="item.text">
        </dao-option>
      </dao-select>
      资源类型：
      <dao-select
        v-model="select"
        size="sm"
        style="width: 160px; height: 32px;"
      >
        <dao-option
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          :label="item.text">
        </dao-option>
      </dao-select>
      <span style="float: right;">
        <dao-input
          search
          placeholder="搜索"
          style="width: 200px; height: 32px;"
        >
        </dao-input>
        <el-button size="mini" style="margin-left: 10px;">
          <span>
            <svg class="icon">
              <use :xlink:href="`#icon_cw`"></use>
            </svg>
          </span>
        </el-button>
      </span>
    </div>
    <div style="margin: 20px;">
      <el-table
        style="width: 100%; height: 420px;"
        :data="tableData"
      >
        <el-table-column label="服务名" prop="serviceName" @click="linkToDetail"></el-table-column>
        <el-table-column label="可用区" prop="zone"></el-table-column>
        <el-table-column label="供应商" prop="supplier"></el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <svg class="icon" style="color: #25D473">
              <use :xlink:href="`#icon_status-dot-small`"></use>
            </svg>
            <span>{{ scope.row.state }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="type"></el-table-column>
        <el-table-column label="服务数" prop="serviceNum" width="100"></el-table-column>
        <el-table-column label="分类" prop="classify"></el-table-column>
        <el-table-column label="安装时间" prop="date"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Service',
  data() {
    return {
      select: 1,
      items: [
        {
          text: '全部',
          value: 1,
        },
        {
          text: '选项1',
          value: 2,
        },
      ],
      tableData: [
        {
          serviceName: 'ectd',
          zone: '上海-dev',
          supplier: 'RedHat',
          state: '已上架',
          type: 'Operator',
          serviceNum: 1,
          classify: '数据库',
          date: '2020-05-23 12:24',
        },
        {
          serviceName: 'ectd',
          zone: '上海-dev',
          supplier: 'RedHat',
          state: '已上架',
          type: 'Operator',
          serviceNum: 1,
          classify: '数据库',
          date: '2020-05-23 12:24',
        },
      ],
    };
  },
  methods: {
    linkToDetail() {
      this.$router.push({ name: 'service.detail' });
    },
  },
};
</script>

<style lang="scss" scoped>
#service {
  box-shadow: 0px -1px 0px 0px rgba(228,231,237,1);
  font-size: 14px;
  font-family: SFProText-Regular,SFProText;
  font-weight: 400;
  color: rgba(89,95,105,1);
  border-bottom: 1px solid rgb(228,231,237);
}
</style>
