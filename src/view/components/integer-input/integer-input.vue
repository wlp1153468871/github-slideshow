<template>
  <dao-input
    type="text"
    v-bind="$props"
    v-model="currentValue"
    :message="currentMessage"
    :status="currentStatus"
    @change="handleChange"
    icon-inside>
    <span
      v-if="unit"
      slot="append">
      {{ unit }}
    </span>
  </dao-input>
</template>

<script>
export default {
  name: 'IntegerInput',
  props: {
    value: { type: String, default: '1' },
    unit: { type: String, default: '' },
  },
  data() {
    return {
      currentValue: this.value,
      currentMessage: this.message,
      currentStatus: this.status,
      savedValue: this.value,
      isEdit: this.editState,
    };
  },
  watch: {
    value(val) {
      this.setCurrentValue(val);
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
    onChange(e) {
      if (e === '') return;

      if (!this.checkIsValidNumber(e.trim())) {
        this.status = 'error';
        this.message = '请输入合法的字符';
      } else {
        this.status = '';
        this.message = '';
      }
    },

    checkIsValidNumber(input) {
      if (input === '-') {
        this.setModel(input);
        return true;
      }

      const integer = parseInt(input, 10);
      if (Number.isNaN(integer)) {
        this.setModel('');
        return false;
      }

      const { min = -Infinity, max = Infinity } = this.getIntegerRange();
      if (integer >= min && integer <= max) {
        this.setModel(`${integer}`);
        return true;
      }

      this.setModel(input);
      return false;
    },
  },
  getIntegerRange() {
    let { min = -Infinity, max = Infinity } = this;
    if (typeof min === 'string' && min.startsWith('$')) {
      min = this.model[min.substr(1)] || min;
      if (typeof min === 'string') min = parseInt(min, 10);
    }
    if (typeof max === 'string' && max.startsWith('$')) {
      max = this.model[max.substr(1)] || max;
      if (typeof max === 'string') max = parseInt(max, 10);
    }

    return {
      min, max,
    };
  },

};
</script>
