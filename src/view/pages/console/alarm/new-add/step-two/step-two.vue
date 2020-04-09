<template>
  <div id="alarm-new-add-step-two" class="container">
    <el-form>
      <el-form-item label="规则">
        <el-table :data="chooseRules">
          <el-table-column prop="ruleName" label="规则名"> </el-table-column>
          <el-table-column prop="name" label="指标名"> </el-table-column>
          <el-table-column prop="description" label="告警内容"> </el-table-column>
          <el-table-column prop="threshold" label="阈值" v-slot="{ row }">
            <span>{{ row.threshold.join('') }}</span>
          </el-table-column>
          <el-table-column prop="for" label="持续时间" v-slot="{ row }">
            <span>{{ row.for.join('') }}</span>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="收件人" class="receiver">
        <el-table :data="receiverInfo">
          <el-table-column prop="username" label="用户名"> </el-table-column>
          <el-table-column prop="email" label="用户邮箱"> </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="作用实例">
        <el-table :data="instances">
          <el-table-column prop="name" label="实例名"> </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>
<script src="./step-two.js"></script>
<style lang="scss">
@import './step-two';
</style>
