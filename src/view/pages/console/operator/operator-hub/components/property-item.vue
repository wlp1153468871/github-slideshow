<template>
  <div class="properties-side-panel-property">
    <h5 class="properties-side-panel-property-label">
      {{ label }}
    </h5>
    <p class="properties-side-panel-property-value">
      {{ value }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'PropertyItem',

  props: {
    label: { type: String },
    value: { type: [String, Number] },
  },
};
</script>

<style lang="scss">
.properties-side-panel-property {
  margin-top: 20px;
}

.properties-side-panel-property-label {
  color: #72767b;
  font-weight: 300;
  font-size: 13px;
  margin: 0;
  text-transform: uppercase;
  line-height: 1.1;
}

.properties-side-panel-property-value {
  font-size: 14px;
  margin-top: 5px;
  word-break: break-word;
  min-width: 0;
  overflow-wrap: break-word;
}
</style>
