<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @before-open="onBeforeOpen"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
    @dao-dialog-confirm="onConfirm">
    <dao-setting-section>
      <dao-editable-table
        :config="config"
        v-model="labels"
        @valid="validChange">
      </dao-editable-table>
    </dao-setting-section>
    <div slot="footer">
      <button
        class="dao-btn ghost"
        @click="onClose">
        取消
      </button>
      <button
        :disabled="!isValid"
        class="dao-btn blue"
        @click="onConfirm">
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { isEmpty } from 'lodash';
import { CONFIG_TITLE_TYPE } from '@/core/constants/constants';
import isAnnotationName from '@/core/utils/is-annotation-name';
import isDNS1123 from '@/core/utils/is-DNS-1123';
import dialog from '@/view/mixins/dialog';

export default {
  name: 'EditLabelDialog',
  extends: dialog(),
  props: {
    data: { type: Object, default: () => ({}) },
    dialogTitle: { type: String, default: CONFIG_TITLE_TYPE.LABEL },
  },
  data() {
    return {
      isValid: false,
      labels: [],
      config: {
        header: [
          '键',
          '值',
        ],
        body: [{
          type: 'input',
          name: 'id',
          default: '',
          validate(row, all) {
            if (row.id === '') {
              return '键不能为空';
            }
            if (all.filter(r => r.id === row.id).length > 1) {
              return '变量 ID 不能重复';
            }
            const slashLen = row.id.split('/').length;
            if (slashLen > 2) {
              return '只允许有一个前缀';
            }
            // 没有‘/’
            if (slashLen === 1 && !isAnnotationName(row.id)) {
              return '名字最多63个字符，只能使用"-"、"_"、"."和数字、字母，并且以字母、数字、字符开头和结尾';
            }
            // 有一个 ‘/’
            if (slashLen === 2) {
              const [prefix, name] = row.id.split('/');
              if (!isDNS1123(prefix)) {
                return '前缀需要满足 DNS1123 规范';
              }
              if (!isAnnotationName(name)) {
                return '名字最多63个字符，只能使用"-"、"_"、"."和数字、字母，并且以字母、数字、字符开头和结尾';
              }
            }
            return true;
          },
        },
        {
          type: 'input',
          name: 'name',
          default: '',
          validate(row) {
            if (row.name === '') {
              return '值不能为空';
            }
            return true;
          },
        }],
      },
    };
  },
  watch: {
    data: {
      immediate: true,
      handler() {
        this.init();
      },
    },
    dialogTitle: {
      immediate: true,
      handler(dialogTitle) {
        this.setDialogTitle(`编辑${dialogTitle}`);
      },
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const arr = [];
      if (isEmpty(this.data)) return;
      Object.keys(this.data).forEach(obj => {
        arr.push({ id: obj, name: this.data[obj] });
      });
      this.labels = arr;
    },
    validChange(valid) {
      this.isValid = valid;
    },
    onConfirm() {
      const obj = {};
      this.labels.forEach(label => {
        obj[label.id] = label.name;
      });
      this.$emit('edit', obj);
      this.onClose();
    },
    onBeforeOpen() {
      this.init();
    },
    dialogWillClose() {
      this.labels = [];
    },
  },
};
</script>
