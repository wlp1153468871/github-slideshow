<template>
  <div class="csp-table-container">
    <div class="csp-table-toolbar" v-if="!hideToolbar">
      <div class="csp-table-toolbar-left">
        <slot name="tool"></slot>
      </div>
      <div class="csp-table-toolbar-right">
        <dao-input
          v-if="!hideSearchInput"
          search
          type="text"
          v-model="tSearchWord"
          :placeholder="tPlaceholder"
          @keyup.enter="onSearchKeyupEnter()"
        >
        </dao-input>
        <button v-if="!hideRefresh" class="dao-btn csp-table-update-btn" @click="onRefresh">
          <svg class="icon">
            <use xlink:href="#icon_update"></use>
          </svg>
        </button>
      </div>
    </div>
    <table class="csp-table-layout" v-loading="loading">
      <thead>
        <tr>
          <th v-for="(prop, index) in tProps" :key="index" @click="toggleOrder(prop)">
            <span>{{ prop.name }}</span>
            <template v-if="(prop.sort !== false && tField === prop.sort) || tField === prop.id">
              <svg class="icon sort-arrow" v-show="tOrder === 'desc'">
                <use xlink:href="#icon_down-arrow"></use>
              </svg>
              <svg class="icon sort-arrow" v-show="tOrder === 'asc'">
                <use xlink:href="#icon_up-arrow"></use>
              </svg>
            </template>
          </th>
          <th class="operation" v-if="tOperations.length"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in tCurrentRows"
          :key="index"
          :class="{ selected: tSelected === index }"
          @click="onSelectRow(item, index, $event)"
        >
          <td v-for="(prop, index) in tProps" :key="index">
            <span v-if="prop.type === DATA_TYPE.TEXT" :title="renderText(item, prop)">
              {{ renderText(item, prop) }}
            </span>
            <link-data
              :row="item"
              v-if="prop.type === DATA_TYPE.LINK"
              @click="prop.other.onClick"
              :text="renderText(item, prop)"
            >
            </link-data>
            <status-data
              :row="item"
              v-if="prop.type === DATA_TYPE.STATUS"
              :other="prop.other"
              :text="renderText(item, prop)"
            >
            </status-data>
          </td>
          <td v-if="tOperations.length" class="operation">
            <operation-data :row="item" :operations="tOperations"> </operation-data>
          </td>
        </tr>
      </tbody>
      <tbody v-if="!tCurrentRows.length">
        <tr>
          <td :colspan="tProps.length">
            <empty-state :title="emptyText"> </empty-state>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <el-table
      v-loading="loading"
      :data="tCurrentRows"
      style="width: 100%">
      <el-table-column
        :show-overflow-tooltip="true"
        v-for="(prop, index) in tProps"
        :key="index"
        sortable
        :prop="prop.id"
        :label="prop.name">
        <template slot-scope="{ row }">
          <span v-if="prop.type === DATA_TYPE.TEXT">
            {{ renderText(row, prop) }}
          </span>
          <link-data
            :row="row"
            v-if="prop.type === DATA_TYPE.LINK"
            @click="prop.other.onClick"
            :text="renderText(row, prop)">
          </link-data>
          <status-data
            :row="row"
            v-if="prop.type === DATA_TYPE.STATUS"
            :other="prop.other"
            :text="renderText(row, prop)">
          </status-data>
        </template>
      </el-table-column>
      <el-table-column v-if="tOperations.length" width="56px">
        <template slot-scope="{ row: row }">
          <operation-data
            :row="item"
            :operations="tOperations">
          </operation-data>
        </template>
      </el-table-column>
    </el-table> -->
    <dao-table-pagination
      style="margin-top: 10px;"
      :pagination="tPagination"
      @prev="prev"
      @next="next"
    >
    </dao-table-pagination>
  </div>
</template>

<script src="./dao-table.js"></script>

<style lang="scss">
@import './dao-table.scss';
</style>
