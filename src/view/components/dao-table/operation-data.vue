<template>
  <dao-dropdown
    trigger="click"
    :append-to-body="true"
    placement="bottom-end">
    <svg class="icon dropdown-trigger">
      <use xlink:href="#icon_more"></use>
    </svg>
    <dao-dropdown-menu slot="list">
      <dao-dropdown-item
        v-for="o in flattenedOperations"
        :key="o.name"
        :v-if="o.visible"
        :is-disabled="o.disabled"
        @click="operate(o.event)">
        <span>{{ o.name }}</span>
        <svg
          v-if="o.disabled"
          v-dao-tooltip="{
            content: o.tooltip,
            disabled: !o.disabled
        }">
          <use xlink:href="#icon_key"></use>
        </svg>
      </dao-dropdown-item>
    </dao-dropdown-menu>
  </dao-dropdown>
</template>

<script>
export default {
  name: 'OperationTd',
  props: {
    operations: { type: Array, default: () => [] },
    row: { type: Object, default: () => ({}) },
  },
  computed: {
    flattenedOperations() {
      const ops = [];
      this.operations.forEach(op => {
        let { disabled = false, visible = true } = op;
        if (typeof op.disabled === 'function') {
          disabled = op.disabled(this.row);
        }
        if (typeof op.visible === 'function') {
          visible = op.visible(this.row);
        }
        if (visible) {
          ops.push({
            ...op,
            disabled,
            visible,
          });
        }
      });
      return ops;
    },
  },
  methods: {
    operate(event) {
      // 直接让列表组件 emit 事件，这样就不用通过列表透传事件了
      this.$parent.$emit(event, this.row);
    },
  },
};
</script>
