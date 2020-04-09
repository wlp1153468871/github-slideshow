<template>
  <div class="resource-size">
    <dao-input
      icon-inside
      v-model="amount"
      type="text"
      :class="clazz"
      :status="status"
      :message="message"
    >
    </dao-input>
    <el-select disabled size="small" style="width: 120px;" v-model="unit">
      <el-option-group v-for="group in units" :key="group.label" :label="group.label">
        <el-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-option-group>
    </el-select>
  </div>
</template>

<script>
import { nth } from 'lodash';

export default {
  name: 'storage-input',

  props: {
    value: { type: String },
    clazz: { type: String },
    status: { type: String },
    message: { type: String },
  },

  data() {
    return {
      amount: '1',
      unit: 'G',
      units: [
        {
          label: 'Binary Units',
          options: [
            {
              value: 'Mi',
              label: 'MiB',
            },
            {
              value: 'Gi',
              label: 'GiB',
            },
            {
              value: 'Ti',
              label: 'TiB',
            },
          ],
        },
        {
          label: 'Decimal Units',
          options: [
            {
              value: 'M',
              label: 'MB',
            },
            {
              value: 'G',
              label: 'GB',
            },
            {
              value: 'T',
              label: 'TB',
            },
          ],
        },
      ],
    };
  },

  created() {
    const [amount, unit] = this.splitStorage(this.value);
    this.amount = amount;
    this.unit = unit;
  },

  methods: {
    splitStorage(value) {
      const split = /(-?[0-9.]+)\s*(.*)/.exec(value);
      if (!split) {
        // We didn't get an amount? shouldn't happen but just in case
        return [value, null];
      }
      const amount = nth(split, 1);
      const unit = nth(split, 2);
      return [amount, unit];
    },
  },

  watch: {
    amount(value) {
      this.$emit('input', `${value}${this.unit}`);
    },
  },
};
</script>
