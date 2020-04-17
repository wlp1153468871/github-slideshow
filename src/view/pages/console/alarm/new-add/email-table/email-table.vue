<template>
  <div class="alarm-instances-table">
    <el-table :data="chooseReceiverInfo">
      <el-table-column prop="username" label="用户名"> </el-table-column>
      <el-table-column prop="email" label="用户邮箱"> </el-table-column>
      <el-table-column label="操作" v-slot="{ row }">
        <button @click="onDeleteReceiver(row.email)" class="dao-btn mini red btn-sm" type="text">
          删除
        </button>
      </el-table-column>
    </el-table>
    <button class="dao-btn blue addReceiverBtn" @click="onAddReceiver">
      增加收件人
    </button>
    <dao-dialog header="选择收件人" :visible.sync="dialogOn" @confirm="onConfirm" @closed="onClose">
      <el-form class="receiver-dialog">
        <el-form-item label="收件人">
          <el-select
            filterable
            v-model="candidates"
            value-key="email"
            multiple
            collapse-tags
            placeholder="输入或选择邮箱"
          >
            <el-option
              v-for="ri in unChooseReceiverInfo"
              :label="ri.email"
              :key="ri.email"
              :value="ri"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </dao-dialog>
  </div>
</template>
<script src="./email-table.js"></script>
<style lang="scss">
@import '../instances-table/instances-table';
</style>
