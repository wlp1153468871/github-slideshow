<template>
  <dao-dialog
    :header="{ title: '你确定要暂停调度吗？' }"
    :visible.sync="isShow"
  >
    <div class="p-lg">此操作将节点标记为不可调度的。新应用将不会被调度到该节点。</div>
    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">取消</button>
      <save-button class="dao-btn red" text="确定" :saving="isSaving" @click="onConfirm">
      </save-button>
    </div>
  </dao-dialog>
</template>

<script>
import { cloneDeep } from 'lodash';
import NodeService from '@/core/services/node.service';
import Dialog from '../../../plugins/dialog';

export default {
  name: 'SchedulingDisabledDialog',
  extends: Dialog,
  props: ['visible', 'node', 'zoneId'],
  data() {
    return {
      changedData: [],
      isSaving: false,
    };
  },
  methods: {
    onConfirm() {
      this.isSaving = true;
      this.changedData = cloneDeep(this.node);
      this.changedData.spec.unschedulable = true;
      NodeService
        .updateNode(this.node.metadata.name, this.changedData, this.zoneId)
        .then(() => {
          this.isSaving = false;
          this.$noty.success(`主机 ${this.node.metadata.name} 成功暂停调度`);
          this.onClose();
          this.$emit('updatetNodeList');
        })
        .catch(() => {
          this.isSaving = false;
          this.$noty.error(`主机 ${this.node.metadata.name} 暂停调度失败`);
        });
    },
  },
};
</script>
