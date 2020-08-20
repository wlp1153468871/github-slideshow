<template>
  <dao-dialog
    :header="{ title: '你确定要继续调度吗？' }"
    :visible.sync="isShow"
  >
    <div class="pt-lg pb-lg pl-lg pr-lg">此操作将节点标记为可调度的。新应用将可以被调度到该节点。</div>
    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">取消</button>
      <button class="dao-btn red" @click="onConfirm">确定</button>
    </div>
  </dao-dialog>
</template>

<script>
import { cloneDeep } from 'lodash';
import NodeService from '@/core/services/node.service';
import Dialog from '../../../plugins/dialog';

export default {
  name: 'ContinueSchedulingDialog',
  extends: Dialog,
  props: ['visible', 'node', 'zoneId'],
  methods: {
    onConfirm() {
      this.changedData = cloneDeep(this.node);
      this.changedData.spec.unschedulable = false;
      NodeService
        .updateNode(this.node.metadata.name, this.changedData, this.zoneId)
        .then(() => {
          this.$noty.success(`主机 ${this.node.metadata.name} 成功继续调度`);
          this.onClose();
          this.$emit('updatetNodeList');
        })
        .catch(() => {
          this.$noty.error(`主机 ${this.node.metadata.name} 继续调度失败`);
        });
    },
  },
};
</script>
