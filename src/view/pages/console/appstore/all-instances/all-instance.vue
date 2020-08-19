<template>
  <div id="allInstances">
    <div class="header">实例列表</div>
    <dao-input
      search
      v-model="key"
      @change="updateKey"
      placeholder="搜索"
      class="search"
    >
    </dao-input>
    <span class="fresh" @click="fresh">
      <el-button size="mini" style="margin-left: 10px;" >
        <span>
          <svg class="icon">
            <use :xlink:href="`#icon_cw`"></use>
          </svg>
        </span>
      </el-button>
    </span>
    <div class="table">
      <el-table
        :data="instances"
      >
        <el-table-column label="实例名称" width="250">
          <template slot-scope="scope">
            <div style="color: #217EF2;" @click="rowClick(scope.row.id)">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属应用" prop="appName"></el-table-column>
        <el-table-column label="Chart 版本" prop="chartVersion" width="150"></el-table-column>
        <el-table-column label="状态" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 'deployed'">
              <svg class="icon" style="color: #25D473">
                <use :xlink:href="`#icon_status-dot-small`"></use>
              </svg>
              <span>运行中</span>
            </div>
            <div v-else>
              <svg class="icon" style="color: red">
                <use :xlink:href="`#icon_status-dot-small`"></use>
              </svg>
              <span>失败</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建者" prop="ownerName"></el-table-column>
        <el-table-column label="创建时间" >
          <template slot-scope="scope">
                {{ scope.row.created_at | unix_date('YYYY/MM/DD HH:mm:ss') }}
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <div class="page">共 {{instanceNum()}} 项</div>
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
  </div>
</template>

<script src="./all-instance.js"></script>
<style lang="scss" src='./all-instance.scss' scoped></style>
