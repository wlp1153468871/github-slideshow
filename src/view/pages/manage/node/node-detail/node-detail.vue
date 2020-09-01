<template>
  <div>
    <circle-loading v-if="loading.page"></circle-loading>
    <template v-else>
      <resource-header :resource="resource">
        <template #labels>
          <x-table-status
          :row="node"
          :other="other"
          :text="`${checkCondition(node.status.conditions)}${node.spec.unschedulable ? '，暂停调度': ''}`"
          >
          </x-table-status>
        </template>
        <template #action-buttons>
          <dao-dropdown trigger="click" :append-to-body="true" placement="bottom-end">
            <template>
              <button
                class="dao-btn ghost has-icon"
                @click="openModifyTagDialog(node)"
              >
                <span class="text">修改标签</span>
              </button>
              <el-dropdown @command="handleOperate($event, node)">
                <button class="dao-btn dao-icon ghost">
                  <svg class="icon">
                    <use xlink:href="#icon_down-arrow"></use>
                  </svg>
                </button>
                <el-dropdown-menu slot="dropdown"
                  v-if="$can('platform.node.update')"
                  trigger='click'>
                  <el-dropdown-item
                    command="modifyAnno"
                  >
                    修改注解
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="modifyTaint"
                  >
                    修改污点
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="schedulingDisabled"
                    :disabled="node && node.spec.unschedulable  ? true : false"
                  >
                    暂停调度
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="continueScheduling"
                    :disabled="node && !node.spec.unschedulable ? true : false"
                  >
                    继续调度
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </dao-dropdown>
        </template>
      </resource-header>
      <div class="header-bottom">
        <span class="col">角色：{{processedData.nodeLabels}}</span>
        <span class="col">控制IP：{{processedData.advertisedIp}}</span>
        <span class="taint">污点：
          <hover-card
            class="inline-block"
            :data="processedData.taints"
            type="taint"
            placement="bottom-start"
          >
            <node-taint class="pl-none" :data="processedData.taints"></node-taint>
          </hover-card></span>
        <span class="col">创建时间：{{processedData.kCreatedTime}}</span>
      </div>
      <div class="dao-view-main">
        <!-- 左边栏 -->
        <div class="dao-view-sidebar dao-list-group-container">
          <ul class="dao-list-group">
            <li
              class="dao-list-item"
              :key="index"
              v-for="(item, index) in catalog"
              @click="activeCatalog = item"
              :class="{ 'active': item === activeCatalog }"
            >
              {{ item.label }}
              <span class="icon">
                <svg>
                  <use xlink:href="#icon_caret-right"></use>
                </svg>
              </span>
            </li>
          </ul>
        </div>
        <div class="dao-view-content">
          <!-- 概览 -->
          <div v-if="activeCatalog.id === 'overview'">
            <overview-panel :node='node'></overview-panel>
          </div>
          <!-- 系统 -->
          <div v-if="activeCatalog.id === 'system'">
            <system-panel :node='node'></system-panel>
          </div>
          <!-- 事件 -->
          <div v-if="activeCatalog.id === 'event'">
            <event-panel :node='node'></event-panel>
          </div>
          <!-- 容器组 -->
          <div v-if="activeCatalog.id === 'pods'">
            <pods-panel></pods-panel>
          </div>
        </div>
      </div>
    </template>
    <!-- dialog -->
     <node-operation-dialog
     ref="NodeOperationDialog"
      @updatetNodeList='getNodeDetail'>
     </node-operation-dialog>
  </div>
</template>
<script src='./node-detail.js'></script>
<style scoped>
.dao-btn.ghost{
      border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.el-dropdown .dao-btn.ghost{
  border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: none;
}
.header-bottom {
    padding: 7px 20px;
    border-bottom: 1px solid #e4e7ed;
    box-shadow: 0 1px 4px 0 rgba(204,209,217,.3);
    background-color: #fbfcfc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    font-size: 13px;
    line-height: 24px;
    color: #9ba3af;
}
.col {
    width: 23%;
  }
.taint{
  width: 31%;
}
.hover-card {
  display: inline-block;
}
</style>
