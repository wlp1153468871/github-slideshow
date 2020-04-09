<template>
  <div id="alarm-list-container">
    <el-form :inline="true" class="demo-form-inline form-panel">
      <el-form-item label="类型">
        <el-select
          filterable
          size="small"
          :disabled="false"
          v-model="filterType"
          placeholder="请选择"
          @change="onChooseType"
        >
          <el-option :value="t" :label="t" v-for="t in typeList" :key="t"></el-option>
        </el-select>
        <button
          class="dao-btn blue has-icon add-rules"
          @click.prevent="onAddRules"
          v-if="$can('alert.create', 'alert')"
        >
          <svg class="icon">
            <use xlink:href="#icon_plus-circled"></use>
          </svg>
          <span class="text">添加告警规则</span>
        </button>
      </el-form-item>
    </el-form>
    <rule-table #addRule :rules="currentRules" @updateRulesLayer="updateRulesLayer"> </rule-table>
  </div>
</template>
<script src="./container.js"></script>
