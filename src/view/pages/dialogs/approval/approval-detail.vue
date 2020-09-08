<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
  >
    <dao-setting-layout>
      <dao-setting-section>
        <template #label>实例名 / 类型</template>
        <template #content>{{ instance.name }} / {{ service.name }}</template>
      </dao-setting-section>
      <dao-setting-section>
        <template #content>
          <p>配置详情</p>
          <dao-code-mirror mode="json" :value="requestParams"> </dao-code-mirror>
        </template>
      </dao-setting-section>
    </dao-setting-layout>
     <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">
        取消
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { isObject } from 'lodash';
import dialog from '@/view/mixins/dialog';
import ApprovalService from '@/core/services/approval.service';
// components
import DaoCodeMirror from '@/view/components/config/code-mirror.vue';

export default {
  name: 'ApprovalDetail',

  extends: dialog('查看审批详情'),

  components: {
    DaoCodeMirror,
  },

  props: {
    approvalId: { type: String, default: '' },
  },

  data() {
    return {
      approval: {},
      loadings: {
        approval: false,
      },
    };
  },

  watch: {
    approvalId(id) {
      if (!id) return;

      this.loadApprovalDetail(id);
    },
  },

  computed: {
    service() {
      return this.approval.service || {};
    },

    instance() {
      return this.approval.instance || {};
    },

    requestParams() {
      const { request_json: requestParams } = this.approval;
      if (isObject(requestParams)) {
        return JSON.stringify(requestParams, '', 2);
      }
      return requestParams;
    },
  },

  methods: {
    loadApprovalDetail(id) {
      this.loadings.approval = true;
      ApprovalService.getApproval(id)
        .then(approval => {
          this.approval = approval;
        })
        .finally(() => {
          this.loadings.approval = false;
        });
    },
  },
};
</script>
