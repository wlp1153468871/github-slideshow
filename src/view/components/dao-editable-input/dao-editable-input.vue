<template>
  <div class="dao-editable-input">
    <dao-input
      icon-inside
      v-bind="$props"
      v-model="currentValue"
      :disabled="isDisabled"
      :message="currentMessage"
      :status="currentStatus"
      @change="handleChange"
      @blur="hanldeBlur"
      @keyup.enter="save"
      @keyup.esc="cancel"
    >
      <template v-if="$slots.prepend" slot="prepend"><slot name="prepend"></slot></template>
      <template v-if="$slots.append" slot="append"><slot name="append"></slot></template>
      <template v-if="!$slots.prepend && !$slots.append" slot="button">
        <div class="edit-op">
          <div class="edit-op-toggle" v-show="!isEdit" @click="edit">
            <svg><use xlink:href="#icon_pencil"></use></svg><span class="text">更改</span>
          </div>
          <div class="edit-op-btn" v-show="isEdit">
            <button class="dao-btn blue" @click="save">{{ saveBtnContent }}</button>
            <button class="dao-btn ghost" @click="cancel">取消</button>
          </div>
        </div>
      </template>
    </dao-input>
    <div v-if="$slots.prepend || $slots.append" class="edit-op">
      <div class="edit-op-toggle" v-show="!isEdit" @click="edit">
        <svg><use xlink:href="#icon_pencil"></use></svg><span class="text">更改</span>
      </div>
      <div class="edit-op-btn" v-show="isEdit">
        <button class="dao-btn blue" @click="save">{{ saveBtnContent }}</button>
        <button class="dao-btn ghost" @click="cancel">取消</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DaoEditableInput',
  data() {
    return {
      currentValue: this.value,
      currentMessage: this.message,
      currentStatus: this.status,
      savedValue: this.value,
      isEdit: this.editState,
      preValue: '',
      inited: false,
    };
  },
  props: {
    message: { type: String, default: '' },
    status: { type: String, default: '' },
    value: { type: [String, Boolean], default: '' },
    saveBtnContent: {
      type: String,
      default: '保存',
    },
    editState: { type: Boolean, default: false },
    onCheck: {
      type: Function,
      default() {
        return () => {};
      },
    },
    onSuccess: {
      type: Function,
      default() {
        return () => {};
      },
    },
  },
  computed: {
    isDisabled() {
      return !this.isEdit || this.disabled;
    },
  },
  watch: {
    value(val) {
      this.setCurrentValue(val);
      if (this.inited) return;
      this.inited = true;
      this.preValue = val;
    },
    message(val) {
      this.setCurrentMessage(val);
    },
    status(val) {
      this.setCurrentStatus(val);
    },
  },
  methods: {
    setCurrentValue(value) {
      // 内部修改值的时候要同步外部双向绑定的值
      this.$emit('input', value);
      if (value === this.currentValue) return;
      this.currentValue = value;
    },
    setCurrentMessage(message) {
      if (message === this.currentMessage) return;
      this.currentMessage = message;
    },
    setCurrentStatus(status) {
      if (status === this.currentStatus) return;
      this.currentStatus = status;
    },
    handleChange(value) {
      this.$emit('input', value);
      this.setCurrentValue(value);
      this.$emit('change', value);
    },
    hanldeBlur() {
      this.onCheck();
    },
    edit() {
      this.isEdit = true;
      this.$nextTick(() => {
        this.$el.querySelector('input').focus();
      });
    },
    save() {
      const result = this.onCheck();
      if (result) {
        this.clear();
        this.isEdit = false;
        this.savedValue = this.currentValue;
        this.preValue = this.currentValue;
        this.onSuccess();
        return;
      }
      /*
        内部的 currentMessage 和 currentStatus 修改了，但是 this.message 和 this.status 没修改，
        之后再修改 this.message 和 this.status 没有被 watch 到，这时候需要强制更新下 currentMessage 和 currentStatus 的值
      */
      this.setCurrentMessage(this.message);
      this.setCurrentStatus(this.status);
    },
    cancel() {
      this.clear();
      this.currentValue = this.preValue;
      this.isEdit = false;
    },
    clear() {
      this.setCurrentMessage('');
      this.setCurrentStatus('');
    },
  },
};
</script>

<style lang="scss">
@import '~daoColor';

.dao-editable-input {
  display: inline-flex;
  .dao-popover {
    width: 100%;
  }
  .edit-op {
    padding-left: 20px;
    .edit-op-toggle {
      padding-top: 5px;
      color: $grey-dark;
      cursor: pointer;
      svg {
        width: 16px;
        height: 16px;
        vertical-align: middle;

        fill: $grey-dark;
      }
      .text {
        margin-left: 5px;
        line-height: 16px;
        vertical-align: middle;
      }
    }
  }
}
</style>
