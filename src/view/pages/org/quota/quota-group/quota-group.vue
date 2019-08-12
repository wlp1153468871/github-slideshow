<template>
  <div>
    <quota-gallery
      v-if="!loading"
      :quotas="summaryQuota">
    </quota-gallery>
  </div>
</template>

<script src="./quota-group.js">
</script>
