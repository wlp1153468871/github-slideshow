<template>
  <dao-dialog
    header="修改标签"
    :visible.sync="isShow"
    @before-open="init"
  >
    <div class="p-lg">
      <dao-editable-table
        v-model="labels"
        :config="editableTableConfig"
        @valid="onValid"
      ></dao-editable-table>
    </div>
    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">取消</button>
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
  name: 'ModifyTagDialog',
  extends: Dialog,
  props: ['visible', 'node', 'zoneId'],
  data() {
    return {
      editableTableConfig: {
        header: ['键', '值'],
        body: [
          {
            type: 'input',
            name: 'label',
            validate(_old, _new) {
              const tmp = _.countBy(_new, 'label');

              if (tmp[_old.label] > 1) {
                return '键值不可以重复';
              }

              const reg = new RegExp('^([A-Za-z0-9][-A-Za-z0-9_./]*)?[A-Za-z0-9]$');

              if (!_old.label) {
                return '键不能为空';
              }
              if (!reg.exec(_old.label)) {
                return '键不能为空';
              }
              return true;
            },
          },
          {
            type: 'input',
            name: 'value',
            validate(_old) {
              const reg = new RegExp('^([A-Za-z0-9][-A-Za-z0-9_./]*)?[A-Za-z0-9]$');
              if (_old.value && !reg.exec(_old.value)) {
                return '包含非法字符';
              }
              return true;
            },
          },
        ],
      },
      labels: [],
      tmpLabels: [],
      valid: false,
      changedData: [],
    };
  },
  methods: {
    init() {
      this.changedData = cloneDeep(this.node);
      this.labels = _.map(this.node.metadata.labels, (val, key) => ({
        label: key,
        value: val,
      }));
      console.log('labels', this.labels);
      this.tmpLabels = this.labels;
      this.valid = false;
    },
    onConfirm() {
      const labels = {};
      this.labels.forEach(pair => {
        labels[pair.label] = pair.value || '';
      });
      this.tmpLabels.forEach(pair => {
        if (!labels[pair.label] && labels[pair.label] !== '') {
          labels[pair.label] = null;
        }
      });
      this.changedData.metadata.labels = labels;
      NodeService
        .updateNode(this.node.metadata.name, this.changedData, this.zoneId)
        .then(() => {
          this.$noty.success('标签修改成功');
          this.onClose();
          this.$emit('updatetNodeList');
        })
        .catch(rej => {
          this.$noty.error(`标签修改失败，错误信息是: ${rej}`);
        });
    },
    onValid(val) {
      this.valid = val;
    },
  },
};
</script>
