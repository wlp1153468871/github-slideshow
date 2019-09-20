<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @opened="onOpened"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
  >
    <dao-setting-layout v-loading="loading">
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">申请人</div>
          <p slot="content">
            {{approval.applicant_name}}
          </p>
        </dao-setting-item>
        <dao-setting-item>
          <div slot="label">{{scope === 'space' ? this.spaceDescription:this.orgDescription}}</div>
          <p slot="content">
            {{scope === 'space' ? approval.space_name :  approval.organization_name || '-'}}
          </p>
        </dao-setting-item>
        <dao-setting-item>
          <div slot="label">提交时间</div>
          <p slot="content">
            {{approval.created_at | unix_date('YYYY/MM/DD HH:mm:ss')}}
          </p>
        </dao-setting-item>
        <dao-setting-item>
          <div slot="label">原有配额</div>
          <p slot="content">
            {{ approval.current_hard | quotaHardTableRow }}
          </p>
        </dao-setting-item>
        <dao-setting-item>
          <div slot="label">申请配额</div>
          <p slot="content">
            {{ approval.apply_hard | quotaHardTableRow }}
          </p>
        </dao-setting-item>
        <dao-setting-item>
          <div slot="label">备注</div>
          <p slot="content">
            {{ approval.remark || '-'}}
          </p>
        </dao-setting-item>
        <template v-if="type==='detail'">
          <dao-setting-item>
            <div slot="label">处理人</div>
            <p slot="content">
              {{ approval.approver_name || '-'}}
            </p>
          </dao-setting-item>
          <dao-setting-item>
            <div slot="label">处理结果</div>
            <p slot="content">
              {{ approval.status | quotaStatus}}
            </p>
          </dao-setting-item>
          <dao-setting-item>
            <div slot="label">审批回复</div>
            <p slot="content">
              {{ approval.reply || '-'}}
            </p>
          </dao-setting-item>
        </template>
        <dao-setting-item
          v-if="approval.status === 'approving' && type === 'rejected' || type === 'success'"
        >
          <div slot="label">回复（可选）</div>
          <div slot="content">
            <textarea
              class="dao-control"
              type="text"
              rows="3"
              name="reply"
              data-vv-as="备注"
              v-validate="`max:255`"
              cols="50"
              placeholder="请填写回复"
              v-model="reply"
            >
            </textarea>
            <div class="dao-input-message error">
              <span>{{veeErrors.first('reply')}}</span>
            </div>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>

    <div slot="footer">
      <button
        class="dao-btn ghost"
        @click="onClose"
        v-if="hasCancelBtn"
      >
        取消
      </button>
      <button
        class="dao-btn blue"
        @click="onSubmit"
      >
        {{submitText}}
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import dialog from '@/view/mixins/dialog';

import { byte2gib } from '@/core/utils/gib2byte';

const textMap = {
  detail: {
    title: '请求详情',
    submitText: '关闭',
    hasCancelBtn: false,
  },
  cancel: {
    title: '撤销配额更新请求',
    submitText: '确认撤销',
    hasCancelBtn: true,
  },
  success: {
    title: '同意配额更新请求',
    submitText: '确认同意',
    hasCancelBtn: true,
  },
  rejected: {
    title: '拒绝配额更新请求',
    submitText: '确认拒绝',
    hasCancelBtn: true,
  },
};

export default {
  name: 'QuotaApprovalDialog',
  extends: dialog(),

  props: {
    approval: { type: Object, default: () => ({}) },
    loading: { type: Boolean, default: false },
    type: { type: String, default: 'detail' }, // detail: 详情, cancel 撤回, success 同意, rejected 拒绝
    scope: { type: String, default: 'space' }, // space: 项目组, org: 租户
  },

  computed: {
    ...mapGetters(['spaceDescription', 'orgDescription']),
  },

  watch: {
    title: {
      immediate: true,
      handler(title) {
        this.setDialogTitle(title);
      },
    },
    type: {
      immediate: true,
      handler(type) {
        this.title = textMap[type].title;
        this.hasCancelBtn = textMap[type].hasCancelBtn;
        this.submitText = textMap[type].submitText;
      },
    },
  },

  methods: {
    onClose() {
      if (this.$validator) this.$validator.pause();
      if (this.dialogWillClose) {
        this.dialogWillClose();
      }
      this.reply = '';
      this.$emit('close');
    },
    onOpened() {
      if (this.$validator) this.$validator.resume();
      this.$emit('opened');
    },
    onSubmit() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.$emit('submit', this.approval, this.reply);
        }
      });
    },
  },

  data() {
    return {
      reply: '',
      title: '',
    };
  },
  filters: {
    quotaHardTableRow(hard) {
      if (!hard) {
        return '';
      }
      return (
        `${byte2gib(hard.cpu, 'CPU')} Core CPU` +
        `， ${byte2gib(hard.memory)}GB 内存， ${byte2gib(hard.storage)}GB 存储`
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
};
</script>

<style lang="scss" scope>
textarea {
  width: 100%;
  height: 250px !important;
  resize: none;
}
</style>
