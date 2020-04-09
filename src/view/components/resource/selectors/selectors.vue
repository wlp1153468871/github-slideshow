<template>
  <div v-if="!selector">none</div>
  <div v-else-if="selector">
    <div v-if="selector.matchLabels || selector.matchExpressions">
      <div v-for="(selectorLabel, selectorValue) in selector.matchLabels" :key="selectorLabel">
        {{ selectorLabel }}={{ selectorValue }}
      </div>
      <div v-for="requirement in selector.matchExpressions" :key="requirement.key">
        {{ requirement.key }}
        {{ requirement.operator | startCase | lowercase }}
        <span v-for="(value, index) in requirement.values" :key="index">
          <span v-if="index === 0">(</span>{{ value }}
          <span v-if="index !== requirement.values.length - 1">,</span>
          <span v-if="index === requirement.values.length - 1">)</span>
        </span>
      </div>
    </div>
    <div v-else-if="!selector.matchLabels && !selector.matchExpressions">
      <div v-for="(selectorLabel, selectorValue) in selector" :key="selectorLabel">
        {{ selectorLabel }}={{ selectorValue }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Selectors',

  props: { selector: { type: Object, default: () => ({}) } },

  data() {
    return {};
  },
};
</script>

<style scoped></style>
