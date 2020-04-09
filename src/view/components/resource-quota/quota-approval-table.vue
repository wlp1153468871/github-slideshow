<template>
  <div>
    <x-table
      :data="parsedData"
      :filter-method="filterMethod"
      :loading="loading"
      small
      :search-placeholder="
        showSpaceCol ? `搜索 申请人、${this.orgDescription}、${spaceDescription}` : '搜索 申请人'
      "
      @refresh="onRefresh"
    >
      <el-table-column prop="applicant_name" label="申请者"> </el-table-column>

      <el-table-column prop="space_name" :label="spaceDescription" v-if="showSpaceCol">
      </el-table-column>

      <el-table-column prop="created_at" label="提交时间" width="150">
        <template #default="{ row: approval }">
          <div>
            {{ approval.created_at | unix_date('YYYY/MM/DD') }}
            <div class="minor-info">
              {{ approval.created_at | unix_date('HH:mm:ss') }}
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="原有配额" width="400">
        <template #default="{ row: approval }">
          {{ approval.current_hard | quotaHardTableRow }}
        </template>
      </el-table-column>

      <el-table-column label="申请配额" width="400">
        <template #default="{ row: approval }">
          {{ approval.apply_hard | quotaHardTableRow }}
        </template>
      </el-table-column>

      <el-table-column prop="remark" label="备注" show-overflow-tooltip> </el-table-column>

      <el-table-column label="审批状态">
        <template #default="{ row: approval }">
          {{ approval.status | quotaStatus }}
        </template>
      </el-table-column>

      <el-table-column fixed="right" :align="'center'" label="操作">
        <template #default="{ row: approval }">
          <button
            class="dao-btn btn-sm mini blue"
            @click="openDialog(approval, 'detail')"
            v-if="approval.status !== 'approving'"
          >
            详情
          </button>
          <template v-if="approval.status === 'approving'">
            <button
              class="dao-btn btn-sm mini blue"
              @click="openDialog(approval, 'success')"
              v-if="type === 'approval'"
            >
              同意
            </button>
            <br v-if="type === 'approval'" />
            <button
              class="dao-btn btn-sm mini red"
              @click="openDialog(approval, 'rejected')"
              v-if="type === 'approval'"
            >
              拒绝
            </button>
            <button
              class="dao-btn btn-sm mini red"
              v-if="type === 'apply'"
              @click="openDialog(approval, 'cancel')"
            >
              撤销
            </button>
          </template>
        </template>
      </el-table-column>
    </x-table>

    <quota-approval-dialog
      :visible.sync="dialogConfigs.visible"
      :type="dialogConfigs.type"
      :scope="scope"
      :loading="dialogConfigs.loading"
      :approval="dialogConfigs.approval"
      @submit="onSubmit"
      @close="dialogConfigs.visible = false"
    >
    </quota-approval-dialog>
  </div>
</template>

<script>
import { has } from 'lodash';
import { mapGetters } from 'vuex';
import { byte2gib } from '@/core/utils/gib2byte';

import resourceQuotaService from '@/core/services/resourceQuota.service';

import QuotaApprovalDialog from './quota-approval-dialog.vue';

export default {
  name: 'ApprovalRequestTable',

  props: ['loading', 'approvals', 'showSpaceCol', 'type', 'scope'],

  components: {
    QuotaApprovalDialog,
  },
  filters: {
    quotaHardTableRow(hard) {
      if (!hard) {
        return '';
      }
      return (
        `${byte2gib(hard.cpu, 'CPU')} Core CPU，` +
        ` ${byte2gib(hard.memory)}G 内存， ${byte2gib(hard.storage)}G 存储`
      );
    },
    quotaStatus(status) {
      switch (status) {
        case 'approving':
          return '审批中';
        case 'rejected':
          return '已拒绝';
        case 'success':
          return '已通过';
        case 'cancel':
          return '已撤销';
        default:
          return status;
      }
    },
  },

  data() {
    return {
      dialogConfigs: {
        visible: false,
        type: 'detail',
        loading: false,
        approval: {},
      },
      approveList: [],
    };
  },

  computed: {
    ...mapGetters(['userId', 'spaceDescription', 'orgDescription']),

    parsedData() {
      return this.approvals.map(i => i).sort((a, b) => b.created_at - a.created_at);
    },
  },

  methods: {
    filterMethod(item, filterKey) {
      if (this.showSpaceCol) {
        const matchUser =
          has(item, 'applicant_name') && item.applicant_name.toLowerCase().includes(filterKey);
        const matchSpace =
          has(item, 'space_name') && item.space_name.toLowerCase().includes(filterKey);
        return matchUser || matchSpace;
      }
      return has(item, 'applicant_name') && item.applicant_name.toLowerCase().includes(filterKey);
    },
    onRefresh() {
      this.$emit('refresh');
    },
    openDialog(approval, type) {
      this.dialogConfigs.approval = approval;
      this.dialogConfigs.visible = true;
      this.dialogConfigs.type = type;
    },
    onSubmit(approval, reply) {
      const map = {
        success: '同意',
        rejected: '拒绝',
        cancel: '撤销',
      };
      const typeText = map[this.dialogConfigs.type] || this.dialogConfigs.type;
      switch (this.dialogConfigs.type) {
        case 'success':
        case 'rejected':
        case 'cancel':
          this.dialogConfigs.loading = true;
          resourceQuotaService
            .updateStatus(approval.approval_id, reply, this.dialogConfigs.type)
            .then(() => {
              this.$noty.success(`${typeText}请求成功`);
              this.dialogConfigs.visible = false;
              this.$emit('refresh');
            })
            .catch(err => {
              this.$noty.error(`${typeText}请求失败`, err);
            })
            .finally(() => {
              this.dialogConfigs.loading = false;
            });
          break;
        default:
          this.dialogConfigs.visible = false;
          break;
      }
    },
  },
};
</script>

<style scoped>
.minor-info {
  font-size: 13px;
  line-height: 1.15;
  height: 16px;
  color: #9ba3af;
}
</style>
