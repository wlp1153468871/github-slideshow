<template>
  <div id="zone">
    <div class="header">可用区管理</div>
    <dao-input
      search
      placeholder="搜索"
      class="search"
    >
    </dao-input>
    <span class="fresh">
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
        :data="zoneList"
      >
        <el-table-column label="可用区名称" prop="name" width="250"></el-table-column>
        <el-table-column label="集群地址" prop="clusterUrl" width="250"></el-table-column>
        <el-table-column label="chart仓库地址" prop="chartRepo" width="180"></el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="props">
            <svg class="icon" style="color: #25D473">
              <use :xlink:href="`#icon_status-dot-small`"></use>
            </svg>
            <span>{{props.row.status}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | unix_date('YYYY/MM/DD HH:mm:ss') }}
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <div class="page">共 1 项</div>
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

<script src="./zone.js"></script>

<style lang="scss" src="./zone.scss" scoped></style>
