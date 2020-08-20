<template>
  <div>
    <div class="layout-content-header" v-if='showNodeTitle'>
      节点管理
    </div>
    <div class="dao-view-main">
      <x-table
        v-if="$can('platform.node.get')"
        :showRefresh="$can('platform.node.update')"
        :loading="loadings.node"
        :data="node"
        @refresh="getZonesList"
        :search-placeholder="'搜索节点名称'"
        :filter-method="filterMethod"
        style="width:100%"
      >
        <template #operation v-if='showNodeTitle'>
          <label class="label-input">可用区</label>
          <dao-select
            size="sm"
            v-model="currentZone"
            placeholder="请选择可用区"
            @change="changeZone"
          >
            <dao-option
              v-for="item in zoneList"
              :key="item.name"
              :value="item.id"
              :label="item.name"
            ></dao-option>
          </dao-select>
        </template>
        <el-table-column prop="hostname" sortable label="名称" width="250px">
          <template slot-scope="{ row: node }">
            <router-link
              :to="{
                name: 'manage.node.detail',
                params: { zone: currentZone , node: node.hostname },
              }"
            >
              {{ node.hostname }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="conditions" label="状态" width="150px">
          <template slot-scope="{ row: node }">
            <x-table-status :row="node" :other="other" :text="checkCondition(node.k8sNodeStatus.conditions)">
            </x-table-status>
          </template>
        </el-table-column>
        <el-table-column prop="labels" label="角色" width="150px">
          <template slot-scope="{ row: node }">
            {{node.nodeLabels}}
          </template>
        </el-table-column>
        <el-table-column prop="labels" sortable label="标签" width="270px">
          <template slot-scope="{ row: node }">
            <span>
              <hover-card
                class="inline-block"
                :data="node.labels"
                type="label"
                placement="bottom-start"
              >
               <hover-card-value
                  class="pl-none mt-xs"
                  :data="[node.labels]"
                ></hover-card-value>
              </hover-card>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="cpus" sortable label="逻辑CPU数" width="130px">
          <template slot-scope="{ row: node }">
            {{ node.cpus }}
          </template>
        </el-table-column>
        <el-table-column prop="memory" sortable label="内存容量" width="110px">
          <template slot-scope="{ row: node }">
            {{ node.memoryCapacity }}G
          </template>
        </el-table-column>
        <el-table-column prop="creationTimestamp" sortable label="创建时间" width="120px">
          <template slot-scope="{ row: node }">
            {{ node.kCreatedTime }}
          </template>
        </el-table-column>
        <el-table-column prop="advertisedIp" sortable label="控制IP" width="150px">
          <template slot-scope="{ row: node }">
            {{ node.advertisedIp }}
          </template>
        </el-table-column>
        <el-table-column prop="taints" sortable label="污点" width="200px">
          <template slot-scope="{ row: node }">
            <span>
              <hover-card
                class="inline-block"
                :data="node.taints"
                type="taint"
                placement="bottom-start"
              >
                <node-taint class="pl-none" :data="node.taints"></node-taint>
              </hover-card>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="$can('platform.node.update')"
          fixed="right"
          label="操作"
          align="center"
          header-align="center"
          width="80px"
        >
          <template slot-scope="{ row: node }">
            <el-dropdown @command="handleOperate($event, node)">
              <span>
                <svg class="icon dropdown-trigger">
                  <use xlink:href="#icon_more"></use>
                </svg>
              </span>
              <el-dropdown-menu slot="dropdown"
                v-if="$can('platform.node.update')"
                trigger='click'>
                <el-dropdown-item
                command="modifyTag">
                  修改标签
                </el-dropdown-item>
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
                  :disabled="node.spec.unschedulable  ? true : false"
                >
                  暂停调度
                </el-dropdown-item>
                <el-dropdown-item
                  command="continueScheduling"
                  :disabled="!node.spec.unschedulable ? true : false"
                >
                  继续调度
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </x-table>
    </div>
    <node-operation-dialog ref="NodeOperationDialog" @updatetNodeList='getZonesList'></node-operation-dialog>
  </div>
</template>

<script src="./node-list.js"></script>
<style scoped>
  .label-input {
    margin-right: 10px;
  }
</style>
