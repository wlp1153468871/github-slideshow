<template>
  <span>
    <span v-if="resource.isNew"> {{ resource.metadata.name }} (新建审批中) </span>
    <router-link
      v-else
      :to="{
        name: routerName,
        params: { name: resource.metadata.name },
      }"
    >
      {{ resource.metadata.name }} {{ resource.approveStatus === 'approving' ? '(审批中)' : '' }}
    </router-link>
  </span>
</template>

<script>
export default {
  name: 'el-table-name-cell',
  props: {
    resource: { type: Object, required: true },
    routerName: { type: String, required: true },
  },
};
</script>
