<template>
  <dao-setting-section>
    <dao-setting-item>
      <div slot="label">
        <label v-if="to.label" :for="to.id ? to.id : null">
          {{ to.label }}
        </label>
      </div>
      <div slot="content">
        <dao-radio-group type="simple">
          <dao-radio
            v-for="item in to.options"
            :class="to.classes"
            :key="item.value"
            :label="item.value"
            v-model="model[field.key]">
            {{ item.text }}
          </dao-radio>
        </dao-radio-group>
      </div>
      <p slot="content-helper">
        <span>{{ to.description }}</span>
      </p>
    </dao-setting-item>
  </dao-setting-section>
</template>

<script>
import baseField from './baseField';

export default {
  mixins: [baseField],
};
</script>
