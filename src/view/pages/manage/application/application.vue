<template>
  <div id="service" v-if="$can('platform.applications.view')">
    <div class="layout-content-header">应用模板管理</div>
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
      <dao-dialog
        :visible.sync="isForbidden"
        header="确认是否禁用"
      >
        <div class="body">
          <div>禁用后应用模板在已添加的项目组将不可见</div>
          <div>但不会删除底层实例，是否禁用？</div>
        </div>
        <div slot="footer">
          <button
            class="dao-btn blue"
            @click="forbidden"
            v-if="$can('platform.applications.available')">禁用
          </button>
          <button class="dao-btn" @click="cancel">取消</button>
        </div>
      </dao-dialog>
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
        <el-table-column label="应用名称" sortable>
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
        <el-table-column label="版本数" prop="numVersion" width="100" sortable></el-table-column>
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
        <el-table-column label="创建时间" prop="date" sortable>
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
