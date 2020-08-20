<template>
  <div id="servicedetail1">
    <div class="layout-content-header detail-header">
      <div class="header-text">服务 > 服务详情(Nginx)</div>
    </div>
    <div class="detail-title">
      <span>
        <svg class="icon icon-size">
          <use :xlink:href="`#color-icon_microsoft`"></use>
        </svg>
      </span>
      <div class="title-name">nginx-example-1</div>
      <div class="title-desc">
        状态:
        <div class="title-desc-name">
          <svg class="icon" style="color: #25D473">
            <use :xlink:href="`#icon_status-dot-small`"></use>
          </svg>
          已上架
        </div>
        <div class="title1">Chart 版本:</div>
        <div class="title-desc-name">2.6.0</div>
        <div class="title1">创建时间:</div>
        <div class="title-desc-name">2020-05-26 10:23:34</div>
      </div>
    </div>
    <el-tabs v-model="activeName" style="position:relative;">
      <el-tab-pane label="概览" name="first">
        <div class="lay-left">
          <div class="border-box">
            <div class="title">基本信息</div>
            <div class="desc">
              <div class="desc-title">应用描述</div>
              <div class="desc-text">klansdkjahksjd</div>
            </div>
            <div class="app">
                <div class="app-title">应用信息</div>
                <div class="app-text-name">分类</div>
                <div class="app-text-name">服务类型</div>
                <div class="app-text-desc">
                  <!-- <template>
                    <span
                      class="str"
                      v-for="(item, index) in appInfo.category"
                      :key="index">
                      {{item}}
                    </span>
                  </template> -->
                  网络
                </div>
                <div class="app-text-desc">Service Broker</div>
                <div class="app-text-name">供应商</div>
                <div class="app-text-name">版本数</div>
                <div class="app-text-desc">DaoCloud</div>
                <div class="app-text-desc">3</div>
                <div class="app-text-name">可用区</div>
                <div class="app-text-name">Chart 仓库</div>
                <div class="app-text-desc">上海-prod</div>
                <div class="app-text-desc" style="padding-bottom: 20px;">office-dev</div>
            </div>
          </div>
          <div class="border-box" style="margin-top:20px">
            <div class="title" style="padding: 20px 0 20px 0px;">README</div>
            <!-- <mark-down style="padding: 20px;" :text="`${appInfo.content}`"></mark-down> -->
          </div>
        </div>
        <div class="lay-right">
          <div class="right-type">
            版本:
          </div>
          <dao-select
            v-model="select"
            size="sm"
            class="right-select"
          >
            <dao-option
              v-for="item in items"
              :key="item.value"
              :value="item.value"
              :label="item.text">
            </dao-option>
          </dao-select>
          <div class="right-name">名称</div>
          <div class="right-desc">nginx-ingress</div>
          <div class="right-name">Chart 版本</div>
          <div class="right-desc">0.25.0</div>
          <div class="right-name">分类</div>
          <div class="right-desc">网络</div>
          <div class="right-name">供应商</div>
          <div class="right-desc">社区</div>
          <div class="right-name">帮助链接</div>
          <div class="right-link">http://nginx.org/en/docs/</div>
          <div class="right-name">帮官网链接</div>
          <div class="right-link">http://nginx.org/</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="项目组" name="second">
        <dao-input
          search
          placeholder="搜索">
        </dao-input>
        <span style="float: right;">
          <el-button size="mini" style="margin-left: 10px;">
            <span>
              <svg class="icon">
                <use :xlink:href="`#icon_cw`"></use>
              </svg>
            </span>
          </el-button>
        </span>
        <div style="margin-top: 20px;">
          <el-table
            style="width: 100%; height: 420px;"
            :data="tableData"
          >
            <el-table-column label="项目组名" prop="groupName"></el-table-column>
            <el-table-column label="项目组唯一标识符" prop="groupUnique"></el-table-column>
            <el-table-column label="租户名" prop="tenantName"></el-table-column>
            <el-table-column label="租户唯一标识符" prop="tenantUnique"></el-table-column>
            <el-table-column label="添加日期" prop="date"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="实例" name="thrid">
        <dao-input
          search
          placeholder="搜索">
        </dao-input>
        <span style="float: right;">
          <el-button size="mini" style="margin-left: 10px;">
            <span>
              <svg class="icon">
                <use :xlink:href="`#icon_cw`"></use>
              </svg>
            </span>
          </el-button>
        </span>
        <div style="margin-top: 20px;">
          <el-table
            style="width: 100%; height: 420px;"
            :data="tableData1"
          >
            <el-table-column label="实例名" prop="exampleName"></el-table-column>
            <el-table-column label="Chart 版本" prop="chartType" width="100"></el-table-column>
            <el-table-column label="应用版本" prop="applyName" width="100"></el-table-column>
            <el-table-column label="租户/项目组" prop="tenant"></el-table-column>
            <el-table-column label="状态" width="100">
              <template slot-scope="scope">
                <svg class="icon" style="color: #25D473">
                  <use :xlink:href="`#icon_status-dot-small`"></use>
                </svg>
                <span>{{ scope.row.state }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建者" prop="creator"></el-table-column>
            <el-table-column label="创建日期" prop="date"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script src="./detail.js"></script>

<style lang="scss" src="./detail.scss"></style>
