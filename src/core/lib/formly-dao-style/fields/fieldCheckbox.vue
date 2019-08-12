<template>
  <dao-setting-section>
    <dao-setting-item>
      <div slot="label" v-if="to.label">
        {{ to.label }}
      </div>
      <div slot="content">
        <div
          class="dao-checkbox"
          v-for="item in to.options"
          :key="item.key">
          <label>
            <input
              type="checkbox"
              :value="item.value"
              v-model="model[field.key]"/>
            {{ item.text }}
          </label>
        </div>
      </div>
      <p class="helper-text" v-if="to.description">
        {{ to.description }}
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
