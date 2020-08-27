<template>
  <div id="service">
    <div class="header">应用管理</div>
    <div class="box">
      <span class="title">可用区：</span>
      <dao-select
        v-model="zoneCat"
        size="sm"
        class="input1"
        @change="changeSearch"
      >
        <dao-option
          v-for="item in zones"
          :key="item.id"
          :value="item.id"
          :label="item.name">
        </dao-option>
      </dao-select>
      <span class="title">状态：</span>
      <dao-select
        v-model="statuCat"
        size="sm"
        class="input1"
        style="width: 90px;"
        @change="changeSearch"
      >
        <dao-option
          v-for="item in status"
          :key="item.id"
          :value="item.id"
          :label="item.name">
        </dao-option>
      </dao-select>
      <span class="title">资源类型：</span>
      <dao-select
        v-model="appTypeCat"
        size="sm"
        class="input1"
        style="width: 140px;"
        @change="changeSearch"
      >
        <dao-option
          v-for="item in appType"
          :key="item.name"
          :value="item.id"
          :label="item.name">
        </dao-option>
      </dao-select>
      <button class="dao-btn blue has-icon"  @click="createApp">
        <svg class="icon"><use xlink:href="#icon_plus-circled"></use></svg>
        <span class="text" >创建应用</span>
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
    <div class="select" v-if="selectStatus.length">
      <span class="number">已选择 2 项</span>
      <button
        class="dao-btn status"
        v-if="selectStatus[0] === 0 && selectStatus.length === 1">批量上架
      </button>
      <button
        class="dao-btn status"
        v-if="selectStatus[0] === 1 && selectStatus.length === 1">批量下架
      </button>
      <button class="dao-btn red status">批量删除</button>
    </div>
    <div style="margin: 20px;">
      <el-table
        style="width: 100%;"
        :data="appInfo"
        @select="selectChange"
        @selection-change="selectAll"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="应用名称" width="200">
          <template slot-scope="scope">
            <div style="color: #217EF2;cursor: pointer;" @click="rowClick(scope.row.id)">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="可用区" prop="zoneName" width="100"></el-table-column>
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
        <div class="page">共 {{appNumber()}} 项</div>
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
