<template>
  <div class="filter-panel">
    <template v-for="(filterGroup, groupName) in availableFilters">
      <d-filter-group
        v-if="groupName !== 'keyword'"
        :key="groupName"
        :group-name="groupName"
        :filter-group="filterGroup"
        @change="onFilterChange"
      ></d-filter-group>
    </template>
  </div>
</template>

<script>
import DFilterGroup from './filter-group';

export default {
  name: 'DFilterPanel',

  components: { DFilterGroup },

  props: {
    activeFilters: { type: Object },
    availableFilters: { type: Object },
  },

  methods: {
    onFilterChange(...info) {
      this.$emit('change', ...info);
    },
  },
};
</script>

<style lang="scss">
.filter-panel {
  margin: 0 0 30px;
  padding: 0 20px;
}
</style>
