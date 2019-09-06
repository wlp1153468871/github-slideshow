<template>
  <div class="filter-group">
    <legend class="filter-panel-category-title">
      {{ operatorHubFilterMap[groupName] || groupName }}
    </legend>
    <el-checkbox
      :key="label"
      v-for="(filter, label) in filterGroup"
      v-model="filter.active"
      @change="onChanged(filter)"
    >
      {{ label }}
    </el-checkbox>
  </div>
</template>

<script>
const operatorHubFilterMap = {
  providerType: 'Provider Type',
  installState: 'Install State',
  capabilityLevel: 'Capability Level',
};

export default {
  name: 'DFilterGroup',

  props: {
    groupName: { type: String },
    filterGroup: { type: Object },
  },

  data() {
    return {
      operatorHubFilterMap,
    };
  },

  methods: {
    onChanged(filterGroup) {
      const { groupName } = this;
      const { label, active } = filterGroup;
      this.$emit('change', groupName, label, active);
    },
  },
};
</script>

<style lang="scss">
.filter-group {
  display: flex;
  flex-direction: column;

  .el-checkbox {
    margin: 0;

    .el-checkbox__label {
      min-height: 23px;
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
    }
  }
}

.filter-panel-category-title {
  color: $black-dark;
  text-transform: uppercase;
}
</style>
