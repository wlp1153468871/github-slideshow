<template>
  <div id="service" v-if="$can('platform.applications.view')">
    <div class="header">应用模板管理</div>
    <div class="box">
      <span class="title">可用区：</span>
      <dao-select
        v-model="zoneCat"
        size="sm"
        class="input1"
        @change="handleChange"
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
        @change="handleChange"
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
        @change="handleChange"
      >
        <dao-option
          v-for="item in appType"
          :key="item.id"
          :value="item.id"
          :label="item.name">
        </dao-option>
      </dao-select>
      <!-- <button class="dao-btn blue has-icon"  @click="createApp">
        <svg class="icon"><use xlink:href="#icon_plus-circled"></use></svg>
        <span class="text" >导入应用模板</span>
      </button> -->
      <span style="float: right;">
        <dao-input
          search
          placeholder="搜索"
          v-model="key"
          @change="search"
          style="width: 200px; height: 32px;"
        >
        </dao-input>
        <button class="dao-btn icon-btn" style="margin-left: 10px;" @click="fresh">
          <svg class="icon"><use xlink:href="#icon_cw"></use></svg>
        </button>
      </span>
    </div>
    <div class="select">
      <!-- <span class="number">已选择 {{selectedArr.length}} 项</span> -->
      <button
        class="dao-btn"
        :disabled="selectStatus[0] === 1 || selectStatus.length === 2 || selectStatus.length  < 1"
        @click="handleOnline"
        v-if="$can('platform.applications.available')"
      >批量启用
      </button>
      <button
        class="dao-btn status"
        :disabled="selectStatus[0] === 0 || selectStatus.length === 2 || selectStatus.length  < 1"
        @click="handleOff"
        v-if="$can('platform.applications.available')"
      >批量禁用
      </button>
      <!-- <button
        class="dao-btn red status"
        @click="deleteApplication"
        :disabled="selectedArr.length < 1">批量删除
      </button> -->
    </div>
    <div style="margin: 15px;">
      <el-table
        style="width: 100%;"
        :data="appInfo"
        v-loading="loading.appInfo"
        @select="selectChange"
        @selection-change="selectAll"
        :row-class-name="rowStyle"
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
              <span>已启用</span>
            </div>
            <div v-else>
              <svg class="icon" style="color: #CCD1D9">
                <use :xlink:href="`#icon_status-dot-small`"></use>
              </svg>
              <span>已禁用</span>
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
            {{ scope.row.createdAt | unix_date('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <div class="page" v-if="selectedArr.length">已选择 {{selectedArr.length}} 项</div>
        <div class="page" v-else>共 {{appNumber()}} 项</div>
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

<script src="./application.js"></script>

<style lang="scss" src="./application.scss"></style>
