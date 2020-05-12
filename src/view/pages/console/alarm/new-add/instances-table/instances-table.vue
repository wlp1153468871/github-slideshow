<template>
  <div class="alarm-instances-table">
    <el-table :data="chooseInstances">
      <el-table-column prop="name" label="实例名"> </el-table-column>
      <el-table-column label="操作" v-slot="{ row }">
        <button @click="onDeleteInstances(row.id)" class="dao-btn mini red btn-sm" type="text">
          删除
        </button>
      </el-table-column>
    </el-table>
    <button class="dao-btn blue addReceiverBtn" @click="addInstances">
      增加实例
    </button>
    <dao-dialog header="选择实例" :visible.sync="dialogOn" @confirm="onConfirm" @closed="onClose">
      <el-form class="receiver-dialog">
        <el-form-item label="实例" class="item-row">
          <el-select
            filterable
            v-model="candidates"
            value-key="name"
            multiple
            collapse-tags
            placeholder="选择实例"
          >
            <el-option
              v-for="uni in unChooseInstances"
              :label="uni.name"
              :key="uni.id"
              :value="uni"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </dao-dialog>
  </div>
</template>
<script src="./instances-table.js"></script>
<style lang="scss">
@import './instances-table';
</style>
