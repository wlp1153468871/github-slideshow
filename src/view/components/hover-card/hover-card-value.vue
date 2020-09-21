<template>
  <div class="table-view-card-td-card">
    <div v-if="!!labelsDataArray.length" class="table-view-card-td-container">
      <div class="table-view-card-td-value">{{ labelsValue }}</div>
      <div v-if="labelsDataArray.length > 1" class="table-view-card-td-number">
        +{{ labelsDataArray.length - 1 }}
      </div>
    </div>
    <div v-if="!labelsDataArray.length">-</div>
  </div>
</template>
<script>
export default {
  name: 'HoverCardValue',
  props: {
    data: [Array, Object],
  },
  computed: {
    labelsDataArray() {
      if (Array.isArray(this.data)) {
        return Object.keys(this.data[0]);
      }
      return Object.keys(this.data);
    },
    labelsValue() {
      const label = this.labelsDataArray[0];
      let value = '';
      if (Array.isArray(this.data)) {
        value = this.data[0][label];
      }
      value = this.data[0][label];
      return `${label}:${value || '<空>'}`;
    },
  },
};
</script>
