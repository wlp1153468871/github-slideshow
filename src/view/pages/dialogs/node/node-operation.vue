<template>
  <div>
    <!-- 修改标签 -->
    <modify-tag-dialog
    :visible.sync="dialogs.modifyTag.visible"
    :node="node"
    :zoneId='zoneId'
    @updatetNodeList='getNodeList'
    ></modify-tag-dialog>

    <!-- 修改注释 -->
    <modify-anno-dialog
      :visible.sync="dialogs.modifyAnno.visible"
      :node="node"
      :zoneId='zoneId'
      @updatetNodeList='getNodeList'
    ></modify-anno-dialog>

    <!-- 修改污点 -->
    <modify-taint-dialog
      :visible.sync="dialogs.modifyTaint.visible"
      :node="node"
      :zoneId='zoneId'
      @updatetNodeList='getNodeList'
    ></modify-taint-dialog>

    <!-- 暂停调度 -->
    <scheduling-disabled-dialog
      :visible.sync="dialogs.schedulingDisabled.visible"
      :node="node"
      :zoneId='zoneId'
      @updatetNodeList='getNodeList'
    ></scheduling-disabled-dialog>

    <!-- 继续调度 -->
    <continue-scheduling-dialog
      :visible.sync="dialogs.continueScheduling.visible"
      :node="node"
      :zoneId='zoneId'
      @updatetNodeList='getNodeList'
    ></continue-scheduling-dialog>
  </div>
</template>
<script>
import ModifyTagDialog from './modify-tag.vue';
import ModifyAnnoDialog from './modify-anno.vue';
import ModifyTaintDialog from './modify-taint.vue';
import SchedulingDisabledDialog from './scheduling-disabled.vue';
import ContinueSchedulingDialog from './continue-scheduling.vue';

export default {
  name: 'AppOperationDialog',
  components: {
    ModifyTagDialog,
    ModifyAnnoDialog,
    ModifyTaintDialog,
    SchedulingDisabledDialog,
    ContinueSchedulingDialog,
  },
  data() {
    return {
      node: {},
      zoneId: '',
      dialogs: {
        modifyTag: {
          visible: false,
        },
        modifyAnno: {
          visible: false,
        },
        modifyTaint: {
          visible: false,
        },
        schedulingDisabled: {
          visible: false,
        },
        continueScheduling: {
          visible: false,
        },
      },
    };
  },
  methods: {
    // 修改标签
    onModifyTag(node, zoneId) {
      this.node = node;
      this.zoneId = zoneId;
      this.dialogs.modifyTag.visible = true;
    },
    // 修改注释
    onModifyAnno(node, zoneId) {
      this.node = node;
      this.zoneId = zoneId;
      this.dialogs.modifyAnno.visible = true;
    },
    // 修改污点
    onModifyTaint(node, zoneId) {
      this.node = node;
      this.zoneId = zoneId;
      this.dialogs.modifyTaint.visible = true;
    },
    // 暂停调度
    onSchedulingDisabled(node, zoneId) {
      this.node = node;
      this.zoneId = zoneId;
      this.dialogs.schedulingDisabled.visible = true;
    },
    // 继续调度
    onContinueScheduling(node, zoneId) {
      this.node = node;
      this.zoneId = zoneId;
      this.dialogs.continueScheduling.visible = true;
    },
    getNodeList() {
      this.$emit('updatetNodeList');
    },
  },
};
</script>
