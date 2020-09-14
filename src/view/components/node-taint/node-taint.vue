<template>
  <div class="table-view-card-td-card">
    <div v-if="!!data.length" class="table-view-card-td-container">
      <div class="table-view-card-td-value">{{ firstTaint }}</div>
      <div v-if="data.length > 1" class="table-view-card-td-number">+{{ data.length - 1 }}</div>
    </div>
    <div v-if="!data.length">{{nullValue}}</div>
  </div>
</template>
<script>
export default {
  name: 'NodeTaint',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      nullValue: '<空>',
    };
  },
  computed: {
    firstTaint() {
      if (this.data && this.data.length === 0) return this.nullValue;
      const taint = this.data[0];
      const value = taint.value || '';
      const effect = taint.effect || '';
      return `${taint.key}${value ? '=' : ''}${value || ''}${effect ? ':' : ''}${effect}`;
    },
  },
};
</script>
