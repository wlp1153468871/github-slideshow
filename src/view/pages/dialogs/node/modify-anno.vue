<template>
  <dao-dialog
    :header="{ title: '修改注解' }"
    :visible.sync="isShow"
    @closed="close"
  >
    <div class="modify-anno-dialog">
      <dao-editable-table
        v-model="annotations"
        :config="editableTableConfig"
        @valid="validData"
      ></dao-editable-table>
    </div>
    <div slot="footer">
      <button class="dao-btn ghost" @click="close">取消</button>
      <button
        class="dao-btn blue"
        :disabled="!valid"
        @click="onConfirm"
      >保存</button>
    </div>
  </dao-dialog>
</template>

<script>
import { cloneDeep } from 'lodash';
import NodeService from '@/core/services/node.service';
import Dialog from '../../../plugins/dialog';

export default {
  name: 'ModifyInnoDialog',
  extends: Dialog,
  props: ['visible', 'node', 'zoneId'],
  data() {
    return {
      editableTableConfig: {
        header: ['键', '值'],
        body: [
          {
            type: 'input',
            name: 'annotation',
            validate(_old) {
              const reg = new RegExp('^([A-Za-z0-9][-A-Za-z0-9_./]*)?[A-Za-z0-9]$');
              if (!_old.annotation) {
                return '键不能为空';
              }
              if (!reg.exec(_old.annotation)) {
                return '包含非法字符';
              }
              return true;
            },
          },
          {
            type: 'input',
            name: 'value',
          },
        ],
      },
      annotations: [],
      tmpAnnotations: [],
      valid: true,
      changedData: [],
    };
  },
  watch: {
    node: {
      handler(node) {
        this.annotations = _.map(node.metadata.annotations, (val, key) => ({
          annotation: key,
          value: val,
        }));
        this.tmpAnnotations = _.cloneDeep(this.annotations);
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.annotations = _.cloneDeep(this.tmpAnnotations);
      this.valid = true;
      this.onClose();
    },
    onConfirm() {
      this.changedData = cloneDeep(this.node);
      const annotations = {};
      _.forEach(this.annotations, pair => {
        annotations[pair.annotation] = pair.value || '';
      });
      _.forEach(this.tmpAnnotations, pair => {
        if (!_.has(annotations, pair.annotation)) {
          delete annotations[pair.annotation];
        }
      });
      this.changedData.metadata.annotations = annotations;
      NodeService
        .updateNode(this.node.metadata.name, this.changedData, this.zoneId)
        .then(() => {
          this.$noty.success('注解修改成功');
          this.onClose();
          this.$emit('updatetNodeList');
        })
        .catch(rej => {
          this.$noty.error(`注解修改失败，错误信息是: ${rej.data.message}`);
        });
    },
    validData(valid) {
      this.valid = valid;
    },
  },
};
</script>

<style lang="scss">
.modify-anno-dialog {
  padding: 20px;
}
</style>
