<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @before-open="onBeforeOpen"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
    @dao-dialog-confirm="onConfirm">
    <dao-editable-list
      class="key-value-editor"
      @add="add"
      @remove="remove">
      <li
        slot="list"
        v-for="(d, i) in currentList"
        :key="i"
        @click="select(i)"
        :class="{active: current.index === i}">
        <span>{{d.key || '未设置'}}</span>
        <svg class="icon text-danger" v-show="!d.check">
          <use xlink:href="#icon_warning"></use>
        </svg>
      </li>
      <div
        class="edit-detail"
        slot="content"
        v-if="current.index !== -1">
        <div class="edit-detail-label">
          <span class="left">键</span>
        </div>
        <div class="edit-detail-content">
          <dao-input
            block
            icon-inside
            :message="errorMessage.key"
            :status="errorMessage.key ? 'error' : ''"
            v-model="current.key">
          </dao-input>
        </div>
        <div class="edit-detail-label">
          <span class="left">值</span>
          <div class="right">
            <dao-radio-group>
              <dao-radio label="input" v-model="valueType">手动输入</dao-radio>
              <dao-radio label="upload" v-model="valueType">上传文件</dao-radio>
            </dao-radio-group>
          </div>
        </div>
        <div class="edit-detail-content">
          <textarea
            v-show="valueType === 'input'"
            class="dao-control input-value"
            :placeholder="'例如: cmd'"
            v-model="current.value">
          </textarea>
          <span
            class="hepler-text red"
            v-if="valueError">
            请输入字母、数字或英文字符等组合
          </span>
          <!-- <file-select ref="fileSelect"
            v-show="valueType === 'upload' && !loading.fileContent"
            @file-change="fileChange"></file-select> -->
          <upload-input
            ref="fileSelect"
            v-show="valueType === 'upload' && !loading.fileContent"
            @on-file-change="fileChange">
          </upload-input>
          <p
            v-show="valueType === 'upload' && !loading.fileContent"
            class="text-danger select-file-info">
          请选择文本文件，大小请勿超过 1M
          </p>
          <div
            v-show="valueType === 'upload' && loading.fileContent"
            class="text-primary">
            <svg class="loading-icon icon rotating">
              <use xlink:href="#icon_circle-rotate"></use>
            </svg>
            <span class="text">文件加载中...</span>
          </div>
        </div>
      </div>
    </dao-editable-list>
    <div slot="footer">
      <button
        class="dao-btn ghost"
        @click="onClose">
        取消
      </button>
      <button
        :disabled="!check"
        class="dao-btn blue"
        @click="onConfirm">
        保存
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import {
  isEmpty,
  clone,
  isArray,
  every,
  cloneDeep,
  forEachRight,
  debounce,
  filter,
} from 'lodash';
import dialog from '@/view/mixins/dialog';

const DEFAULT = {
  key: '',
  value: '',
  index: -1,
  check: false,
};

const UNIT_1M = 1024 * 1024;

export default {
  name: 'KeyValueEditor',
  extends: dialog('编辑内容'),
  props: {
    data: { type: Array, default: () => [] },
    validator: { type: Object },
  },
  data() {
    return {
      result: [],
      currentList: [],
      current: clone(DEFAULT),
      errorMessage: {
        key: '',
      },
      check: false,
      loading: {
        // 选择的时候不触发 input 中的 updateResult 事件
        fileContent: false,
      },
      valueType: 'input',
      valueError: false,
    };
  },
  created() {
    this.init(this.data);
    this.$on('reset', () => {
      this.init(this.data);
    });
  },
  watch: {
    data(val) {
      this.init(val);
    },
    'current.key': {
      handler(val) {
        this.updateKey(val);
      },
    },
    'current.value': {
      handler(val) {
        this.updateValue(val);
      },
    },
    currentList: {
      deep: true,
      handler(list) {
        this.updateResult();
        if (!isArray(list) || list.length === 0) {
          this.errorMessage.key = '';
          this.check = true;
          this.$emit('check', true);
          return;
        }
        const check = every(list, {
          check: true,
        });
        this.check = check;
        this.$emit('check', check);
      },
    },
  },
  methods: {
    onConfirm() {
      const obj = {};
      this.currentList.forEach(d => {
        obj[d.key] = d.value;
      });
      this.$emit('edit', obj);
      this.onClose();
    },
    // 初始化数据
    init(value) {
      const val = value || this.data;
      if (!val) return;
      this.currentList = this.formatData(val);
      this.errorMessage.key = '';
      if (this.currentList.length === 0) {
        this.add();
        this.errorMessage.key = '';
      } else {
        this.select(0);
      }
      this.checkCurrentPair();
    },

    // 格式化数据，添加 check 字段
    formatData(data) {
      const pairs = cloneDeep(data);
      this.checkAll(pairs);
      return pairs;
    },
    // 检查所有数据是否符合格式
    checkAll(pairs) {
      forEachRight(pairs, pair => {
        const isInvalidKey = this.checkKey(pair.key);
        pair.check = !isInvalidKey;
        if (this.validator) {
          if (this.validator(pair) !== false) {
            pair.check = false;
            this.valueError = true;
          }
        }
      });
      return pairs;
    },

    // 选择键值对
    select(index) {
      this.current.index = index;
      this.current.key = this.currentList[index].key;
      this.current.value = this.currentList[index].value;
      this.errorMessage.key = this.checkKey(this.current.key);
      this.valueType = 'input';
    },
    // 添加键值对
    add() {
      this.currentList.push({
        key: '',
        value: '',
        check: false,
      });
      this.current = clone(DEFAULT);
      this.current.index = this.currentList.length - 1;
      this.errorMessage.key = '';
      this.valueType = 'input';
    },
    // 删除键值对
    remove() {
      const { index } = this.current;
      if (index === -1) return;
      this.currentList.splice(index, 1);
      this.current = clone(DEFAULT);
      this.errorMessage.key = '';
      this.valueType = 'input';
    },
    // 更新结果中的键值对
    updateResult() {
      this.$emit('result', this.currentList);
    },

    // 更新键
    updateKey: debounce(function updateKey(key) {
      if (this.current.index === -1) return;
      const pair = this.currentList[this.current.index];
      pair.key = key;
      this.checkCurrentPair();
      this.updateResult();
    }),

    // 检查键并给出错误提示
    checkKey(key) {
      let errMsg = '';
      if (this.current.index === -1) {
        errMsg = '';
      } else if (!key) {
        errMsg = '请填写键';
      } else if (!/^[-._a-zA-Z0-9]+$/.test(key)) {
        // 检测非法字符
        errMsg = '不能含有非法字符。只能使用数字、大小写字母、"-"、 "_" 或 "."';
      } else if (
        filter(this.currentList, pair => pair.key === key).length > 1
      ) {
        errMsg = '键重复';
      }
      // [ IS_INVALID, ERR_MESSAGE ]
      return errMsg;
    },

    // 更新值
    updateValue(value) {
      if (this.current.index === -1) return;
      const pair = this.currentList[this.current.index];
      pair.value = value;
      this.checkCurrentPair();
      this.updateResult();
    },

    // 检查键值对是否合法
    checkPair(pair) {
      if (this.checkKey(pair.key)) {
        return false;
      }
      return true;
    },
    // 检查当前选中的键值对是否合法
    checkCurrentPair() {
      if (this.current.index === -1) return;
      const pair = this.currentList[this.current.index];
      pair.check = this.checkPair(pair);
      this.errorMessage.key = this.checkKey(pair.key);
      this.checkAll(this.currentList);
    },

    // 选择上传的文件改变时
    fileChange(files) {
      if (isEmpty(files)) return;
      const { file } = files;
      const reader = new FileReader();
      if (file.size > UNIT_1M) {
        this.$noty.error('文件大小超过 1M！');
        return;
      }
      this.loading.fileContent = true;
      reader.readAsText(file);
      reader.onload = event => {
        if (!this.current.key) {
          this.current.key = file.name;
        }
        this.current.value = event.target.result;
        this.valueType = 'input';
        this.loading.fileContent = false;
      };
    },

    onBeforeOpen() {
      this.init();
    },
  },
};
</script>

<style lang="scss">
@import '~daoColor';
.key-value-editor {
  & .right-pane {
    background-color: $white-dark-lighter !important;
    padding: 0 !important;
  }
  .item-list {
    li {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .edit-detail {
    background-color: $white-dark-lighter;
    padding: 0 20px 15px;
    &-label {
      margin-top: 10px;
      line-height: 27px;
      color: $black-dark;
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      .dao-radio-group {
        & > div {
          display: inline-block;
          padding-left: 10px;
        }
      }
    }
    &-content {
      padding: 5px 0;
      .input-value {
        width: 100%;
        height: 390px - 15px - 54px - 20px - 20px - 32px;
        resize: none;
      }
    }
    .select-file-info {
      font-size: 12px;
      margin-top: 10px;
      position: relative;
      left: 10px;
    }
  }
}
</style>
