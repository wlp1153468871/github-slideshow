<template>
  <div id="service">
    <div class="header">应用管理</div>
    <div class="box">
      <span class="title">可用区：</span>
      <dao-select
        v-model="select"
        size="sm"
        style="width: 160px; height: 32px; margin-right: 10px;"
      >
        <dao-option
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          :label="item.text">
        </dao-option>
      </dao-select>
      <span class="title">状态：</span>
      <dao-select
        v-model="select"
        size="sm"
        style="width: 90px; height: 32px; margin-right: 10px;"
      >
        <dao-option
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          :label="item.text">
        </dao-option>
      </dao-select>
      <span class="title">资源类型：</span>
      <dao-select
        v-model="select"
        size="sm"
        style="width: 140px; height: 32px;"
      >
        <dao-option
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          :label="item.text">
        </dao-option>
      </dao-select>
      <button class="dao-btn blue has-icon" style="margin-left: 10px;">
        <svg class="icon"><use xlink:href="#icon_plus-circled"></use></svg>
        <span class="text">创建应用</span>
      </button>
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
    <div class="select" v-if="false">
      <span class="number">已选择 2 项</span>
      <button class="dao-btn" style="margin-left:10px">批量下架</button>
      <button class="dao-btn red">批量删除</button>
    </div>
    <div style="margin: 20px;">
      <el-table
        style="width: 100%;"
        :data="tableData"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="应用名称" width="200">
          <template slot-scope="scope">
            <div style="color: #217EF2;">
              {{ scope.row.serviceName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="可用区" prop="zone" width="100"></el-table-column>
        <el-table-column label="供应商" prop="supplier" width="100"></el-table-column>
        <el-table-column label="创建者" prop="supplier" width="100"></el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <svg class="icon" style="color: #25D473">
              <use :xlink:href="`#icon_status-dot-small`"></use>
            </svg>
            <span>{{ scope.row.state }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="type" width="100"></el-table-column>
        <el-table-column label="版本数" prop="serviceNum" width="100"></el-table-column>
        <el-table-column label="分类" prop="classify" width="200"></el-table-column>
        <el-table-column label="创建时间" prop="date" width="200"></el-table-column>
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

<script src="./service.js"></script>

<style lang="scss" src="./service.scss" scoped></style>
