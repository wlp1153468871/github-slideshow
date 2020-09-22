<template>
  <dao-dialog
    :header="{ title: '修改污点' }"
    :visible.sync="isShow"
    @before-open="init"
  >
    <div class="p-lg">
      <div class="pb-sm">主机污点可用来帮助你控制哪些节点可以部署容器</div>
      <dao-editable-table
        v-model="taints"
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
  name: 'ModifyTaintDialog',
  extends: Dialog,
  props: ['visible', 'node', 'zoneId'],
  data() {
    return {
      editableTableConfig: {
        header: ['污点'],
        body: [
          {
            type: 'input',
            name: 'taint',
            default: 'node-role.kubernetes.io/master:NoSchedule',
            validate(_old, _new) {
              const tmp = _.countBy(_new, 'taint');

              if (tmp[_old.taint] > 1) {
                return '键不可以重复';
              }
              if (_old.taint.length > 63) {
                return '值不能超过63个字符';
              }
              if (_old.taint === '') return '污点不能为空';
              return true;
            },
          },
        ],
      },
      taints: [],
      valid: false,
      changedData: [],
    };
  },
  methods: {
    init() {
      this.changedData = cloneDeep(this.node);
      this.taints = _.map(this.node.spec.taints, val => {
        const value = val.value || '';
        const effect = val.effect || '';
        const taint = `${val.key}${value ? '=' : ''}${value}${effect ? ':' : ''}${effect}`;
        return {
          taint,
        };
      });
      this.valid = false;
    },
    onConfirm() {
      const taints = [];
      _.forEach(this.taints, pair => {
        taints.push(this.getTaintPair(pair.taint));
      });
      this.changedData.spec.taints = taints;
      NodeService
        .updateNode(this.node.metadata.name, this.changedData, this.zoneId)
        .then(() => {
          this.$noty.success('更新成功');
          this.onClose();
          this.$emit('updatetNodeList');
        })
        .catch(() => {
          this.$noty.error('操作失败');
        });
    },
    onValid(val) {
      this.valid = val;
    },
    getTaintPair(str) {
      const taint = {
        key: '',
        value: '',
        effect: '',
      };
      let keyValue = str; // 假设没有 effect
      const effectIndex = str.indexOf(':');
      const valueIndex = str.indexOf('=');
      if (effectIndex > -1) {
        taint.effect = str.slice(effectIndex + 1);
        keyValue = str.substring(0, effectIndex);
      }
      if (valueIndex > -1) {
        taint.value = keyValue.slice(valueIndex + 1);
        taint.key = keyValue.substring(0, valueIndex);
      } else {
        taint.key = keyValue;
      }
      return taint;
    },
  },
};
</script>
