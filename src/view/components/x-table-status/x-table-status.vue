<template>
  <div @click="onClick" :class="computedStatusClassName">
    <svg class="icon rotating" style="vertical-align: middle;">
      <use
        :style="{ 'fill': typeInfo.color }"
        v-bind="{ 'xlink:href': typeInfo.icon }">
      </use>
    </svg>
    <span>{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'x-table-status',
  props: {
    row: { type: Object, default: () => ({}) },
    text: { type: String, default: '' },
    other: { type: Object, default: () => ({}) },
  },
  created() {
    this.init();
  },
  computed: {
    typeInfo() {
      const statusFilter = this.other.status;
      let { color } = this.$_typeMap.SUCCESS;
      let icon = '#icon_status-dot-small';
      const { status = 'danger' } = this.row;
      if (status) {
        const statusType = statusFilter(status, this.row);
        const type = this.$_typeMap[statusType] || this.$_typeMap.SUCCESS;
        color = type.color || this.$_typeMap.SUCCESS;
        icon = type.icon || '#icon_status-dot-small';
      }

      return {
        color,
        icon,
      };
    },

    rowStatus() {
      return this.row.status;
    },

    computedStatusClassName() {
      if (this.rowStatus === 'create_failed') {
        return 'status-data-error';
      }
      return '';
    },
  },
  methods: {
    init() {
      this.$_typeMap = {

        SUCCESS: { color: '#22c36a' }, // icon: '#icon_status-dot-small'
        DANGER: { color: '#f1483f' }, // icon: '#icon_status-dot-small'
        CONTINUE: { color: '#3890ff', icon: '#icon_circle-rotate' },
        STOPED: { color: '#ccd1d9' }, // icon: '#icon_status-dot-small',
      };
    },

    onClick() {
      const { onClick } = this.other;
      if (onClick) {
        onClick(this.text, this.row);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.status-data-error {
  display: inline-block;
  background-color: #fcedec;
  cursor: pointer;
}
</style>
